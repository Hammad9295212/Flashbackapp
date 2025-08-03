import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {format} from 'date-fns';
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {onSubmitFB, tables} from "../Shared/CommonService";

const SnapView = (props) => {

    const parms = props?.route?.params;

    const navigation = useNavigation();
    const [memory, setMemory] = useState(parms);
    const [loading, setLoading] = useState(false);
    const [currentUser, setUserKey] = useState(null);

    useEffect(() => {
        onRefresh();
    }, []);

    const onRefresh = async () => {
        if (loading) {
            return;
        }
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        if (!user || !user?.key) {
            return;
        }
        setUserKey(user?.userKey);
    }

    const imageUploader = async (imgData) => {
        try {
            if (!imgData) {
                return {
                    status: false,
                    msg: 'Please upload a valid image'
                };
            }

            const form = new FormData();
            form.append('image', imgData);

            const apis = [
                '9d648e6865615783e0e40567df53a91a',
                '9469d0d5027b86ad6be1c0a5e8b14836',
                'f3f4bd051f8c51faa8027040e3cc82d8',
                '847928557f66be5d4f765e7423717cfc',
                'e4bd51cfe737c7500b329400a5a2f593',
                'd57863ac999c4eb3d82c8dbbf46abd9c',
                'a8ce334d48f8e7740b2f36425d5ff732',
                '6b9b3c27e85f28c883292be8e4eaed52',
                '74754f9c4a0d142d4f10eec548927e8a',
            ];
            const apiKey = apis[Math.floor(Math.random() * apis.length)];

            const url = 'https://api.imgbb.com/1/upload?key=' + apiKey;
            const rawResponse = await Promise.race([
                fetch(url, {
                    method: 'POST',
                    body: form
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), 30000)
                )
            ]);
            if (!rawResponse.ok) {
                throw new Error('HTTP error ' + rawResponse.status);
            }
            const res = await rawResponse.json();
            if (res && res.status === 200 && res.data && res.data.url) {
                const fileId = res.data.url.match(/\/([\w-]+)\//)[1];
                return {
                    status: true,
                    msg: fileId
                };
            } else {
                throw new Error('Invalid response from the server');
            }
        } catch (error) {
            return {
                status: false,
                msg: error instanceof Error ? error.message : 'An unknown error occurred'
            };
        }
    };

    const takePhoto = async (isCamera) => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera is required!");
            return;
        }

        let pickerResult;
        if (isCamera) {
            pickerResult = await ImagePicker.launchCameraAsync();
        } else {
            pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsMultipleSelection: true
            });
        }

        const newImages = [];
        if (pickerResult.canceled === false) {
            for (let i = 0; i < pickerResult.assets.length; i++) {
                const localUri = pickerResult.assets[i].uri;
                if (localUri) {
                    const filename = localUri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image`;
                    const obj = {uri: localUri, name: filename, type};
                    const file = await imageUploader(obj);
                    if (file.status === true) {
                        newImages.push(file.msg);
                    } else {
                        Alert.alert('Upload Failed', file.msg);
                    }
                }
            }
        }
        return newImages;
    };

    const onTakeSnaps = async (memory, memoryKey) => {
        if (loading) {
            return;
        }
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        if (!user || !user?.key) {
            Alert.alert('Please login first');
            navigation.navigate('Login');
            return;
        }
        setLoading(true);
        try {
            const mySnapsLeft = (memory?.userMemories || [])?.filter((item) => item?.uploadedBy === currentUser).length;
            if (mySnapsLeft >= Number(memory?.photosLimit)) {
                Alert.alert('You have reached the limit of photos');
                return;
            }

            const photos = memory?.userMemories ? [...memory.userMemories] : [];
            const newImages = await takePhoto(true);

            if (newImages && newImages.length > 0) {
                for (let i = 0; i < newImages?.length; i++) {
                    if (newImages[i]) {
                        photos.push({img: newImages[i], uploadedBy: user?.userKey});
                    }
                }
                // photos.push(...newImages);

                if (photos.length >= Number(memory?.photosLimit)) {
                    Alert.alert('You have reached the limit of photos');
                    return;
                }

                const obj = {
                    ...parms
                };
                obj.userMemories = photos;
                delete obj?.memoryIndex;
                delete obj?.key;


                const res = await onSubmitFB(obj, tables?.memories, parms?.key, null, null);
                if (res?.error === true) {
                    Alert.alert('Failed', res?.msg || 'Memory were not saved');
                    return;
                }
                setMemory({...obj, memoryIndex: parms?.memoryIndex});

                /*  let localMemories = await AsyncStorage.getItem('memories');
                  localMemories = localMemories ? JSON.parse(localMemories) : [];
                  const newMemories = [...localMemories];

                  if (newMemories[memoryKey]) {
                      newMemories[memoryKey].images = photos;
                  } else {
                      newMemories[memoryKey] = {images: photos};
                  }

                  setMemory({...newMemories[memoryKey], memoryIndex: parms?.memoryIndex });
                  await AsyncStorage.setItem('memories', JSON.stringify(newMemories));*/

            }

        } catch (e) {
            Alert.alert('Failed', e?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const onFindSnaps = () => {
        if (!memory || !memory?.userMemories || memory?.userMemories?.length === 0) {
            return ((Number(memory?.photosLimit)) || 0);
        }
        let length = (Number(memory?.photosLimit)) - memory?.userMemories.filter((item) => item?.uploadedBy === currentUser).length;
        length = length > 0 ? length : 0;
        return length;
    }

    const onFindTotalGuests = () => {
        if (!memory || !memory.userMemories || memory.userMemories.length === 0) {
            return 0;
        }
        return memory.userMemories.filter((item) => item.uploadedBy !== currentUser).length;
    };

    if (memory) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton}
                                  onPress={() => {
                                      navigation.goBack();
                                  }}
                >
                    <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
                <Image
                    source={{uri: `https://i.ibb.co/${memory?.images[0]}/ha.png`}}
                    style={styles.image}
                />
                <Text style={styles.title}>{memory?.title}</Text>
                <Text style={styles.subTitle}>Snaps Left: {onFindSnaps()}</Text>
                <Text style={styles.date}>{format(memory?.endDate, 'eee, MMM d, yyyy hh:mm a')}</Text>
                {(onFindTotalGuests() >= Number(memory?.totalGuests)) &&
                    <Text style={[styles.date, {color: 'red', paddingLeft: 20, paddingRight: 20}]}>
                        We've reached the maximum number of guests allowed for this event.
                    </Text>}
                {(memory?.memoryIndex && (onFindTotalGuests() < Number(memory?.totalGuests))) &&
                    <TouchableOpacity style={styles.button} onPress={() => onTakeSnaps(memory, memory?.memoryIndex)}>
                        {
                            loading ?
                                <ActivityIndicator size="small" color="#fff"/>
                                :
                                <Text style={styles.buttonText}>Take Photos →</Text>
                        }
                    </TouchableOpacity>}
            </View>
        );
    } else {
        navigation.goBack();
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 30,
    },
    image: {
        width: '90%',
        height: '50%',
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    subTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 40,
    },
    button: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
});

export default SnapView;
