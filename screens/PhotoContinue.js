import React, {useState} from 'react';
import {
    Alert, Image,
    ScrollView, StyleSheet,
    Switch, Text,
    TouchableOpacity, View,
    TextInput
} from 'react-native';
import {onSubmitFB, tables} from "../Shared/CommonService";
import {MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {Calendar} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import Swiper from 'react-native-swiper'
import Modal from "react-native-modal";
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from "@react-navigation/native";

export default function PhotoContinue(parms) {
    const route = parms.route?.params;

    const navigation = useNavigation();
    const [isGalleryViewable, setIsGalleryViewable] = useState(route?.isGalleryViewable === true);
    const [selectedImage, setSelectedImage] = useState(route?.images || []);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(route?.title);
    const eDate = new Date();
    eDate.setDate(eDate.getDate() + 7);
    const [endDate, setEndDate] = useState(route?.endDate ? (new Date(route?.endDate)) : eDate);
    const [timeAfter, setTimeAfter] = useState(null);
    const [selectedPhotos, setSelectedPhotos] = useState(route?.photosLimit ? route?.photosLimit?.toString() : '10');
    const [totalGuests, setSelectedGuests] = useState(route?.totalGuests ? route?.totalGuests?.toString() : '10');
    const [afterTime, setAfterTime] = useState(route?.afterTime || 1);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#2C2C2E',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#1C1C1E',
        },
        headerText: {
            color: 'white',
            fontSize: 20,
        },
        coverContainer: {
            alignItems: 'center',
            marginVertical: 16,
        },
        slide: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        coverImage: {
            width: '90%',
            height: 400,
            borderRadius: 10,
            marginBottom: 16,
        },
        coverTextContainer: {
            alignItems: 'center',
        },
        input: {
            padding: 10,
            color: 'white',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            width: '80%',
            marginBottom: 10,
        },
        coverDate: {
            color: 'white',
            fontSize: 16,
            marginBottom: 16,
        },
        photoButtonsContainer: {
            flexDirection: 'row',
        },
        photoButton: {
            backgroundColor: '#1C1C1E',
            padding: 10,
            borderRadius: 5,
        },
        photoButtonText: {
            color: 'white',
        },
        detailsContainer: {
            padding: 16,
        },
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        detailText: {
            color: 'white',
            fontSize: 18,
            marginLeft: 16,
        },
        detailSubText: {
            color: 'gray',
            fontSize: 16,
        },
        picker: {
            height: 50,
            width: 150,
            color: 'white',
            backgroundColor: '#444',
        },
        addPhotoButton: {
            backgroundColor: '#292A24',
            padding: 16,
            borderRadius: 5,
            margin: 16,
            alignItems: 'center',
        },
        addPhotoButtonText: {
            color: '#fff',
            fontSize: 16,
        },
    });


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

        if (pickerResult.canceled === false) {
            setLoading(true);
            const newImages = [];
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
            setSelectedImage((prevImages) => [...prevImages, ...newImages]);
            setLoading(false);
        }
    };

    const onSaveMemory = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);
            if (!user || !user?.key) {
                Alert.alert('Please login first');
                navigation.navigate('Login');
                return;
            }

            if (loading) {
                return;
            }

            if (!selectedImage?.length) {
                await takePhoto();
                return;
            }
            setLoading(true);
            const obj = {
                isGalleryViewable,
                images: selectedImage,
                afterTime,
                endDate,
                title: title || 'New',
                photosLimit: Number(selectedPhotos),
                totalGuests,
                createdBy: route?.key ? route?.createdBy : user?.userKey
            };

            const res = await onSubmitFB(obj, tables?.memories, route?.key, null, null);
            if (res?.error === true) {
                Alert.alert('Failed', res?.msg || 'Memory were not saved');
                return;
            }
            navigation.replace("Tab");
        } catch (e) {
            Alert.alert('Failed', e?.message || 'Temporry error occurd');
        } finally {
            setLoading(false);
        }
        /* let memories = await AsyncStorage.getItem('memories');
         memories = memories ? JSON.parse(memories) : [];
         if (!Array.isArray(memories)) {
             memories = [];
         }
         const memoryIndex = memories.findIndex((memory, memoryKey) => ((memoryKey === route?.key) && typeof route?.key === 'number'));
         if (memoryIndex !== -1) {
             memories[memoryIndex] = obj;
         } else {
             memories.push(obj);
         }
         await AsyncStorage.setItem('memories', JSON.stringify(memories));*/


        navigation.goBack();

    }

    const handleDateSelect = (day) => {
        setEndDate(new Date(day.timestamp));
        setIsCalendarVisible(false);
    };

    const onRenderEnding = () => {
        return (
            <Modal isVisible={isCalendarVisible} onBackdropPress={() => setIsCalendarVisible(false)}>
                <View style={styles.modalContent}>
                    <Calendar
                        onDayPress={handleDateSelect}
                        minDate={new Date()}
                        markedDates={{
                            [format(endDate, 'yyyy-MM-dd')]: {selected: true, selectedColor: '#50C7C7'},
                        }}
                        theme={{
                            selectedDayBackgroundColor: '#50C7C7',
                            todayTextColor: '#50C7C7',
                        }}
                    />
                </View>
            </Modal>
        )
    }

    const onFormatDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0'); // Day with leading zero
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month with leading zero (0-indexed)
        const yyyy = today.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
    }

    const timestampToHours = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        return (hours < 10) ? '0' + hours : hours;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="white"/>
                </TouchableOpacity>
                <Text style={styles.headerText}>{title || ''}</Text>
                <MaterialIcons name="edit" size={24} color="white"/>
            </View>
            <View style={styles.coverContainer}>
                <Swiper showsButtons={selectedImage && selectedImage.length > 1} height={'auto'}>
                    {selectedImage && selectedImage.map((img, index) => (
                        <View style={styles.slide} key={img + index}>
                            <Image
                                source={{uri: `https://i.ibb.co/${img}/HA.png`}}
                                style={styles.coverImage}
                            />
                        </View>
                    ))}
                </Swiper>
                {(!selectedImage || selectedImage.length < 1) && (
                    <Image
                        source={{uri: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjK_KUycTsd1UDiUSNvxjcrb2McjD5Ov_PdW2dQjQPbqHoTnviRaKjD1ZUPJ9u1Z9AWyWA5EIfY-YxEF-ePwynZjiSGrlO3weBVKeBu1XNs_H0JprOzQFPiqsHnX-YD5ffQ1fO9CZGfyLEt9MHIGcS1qBeWBHCsqkcWgp9Suj2uo3xoLd-4xQfNCcS55Ms/s320/20240201_093035_0000.png'}}
                        style={styles.coverImage}
                    />
                )}
                <View style={styles.coverTextContainer}>
                    <TextInput
                        maxLength={40}
                        placeholder="Choose title"
                        onChangeText={setTitle}
                        value={title}
                        placeholderTextColor="#fff"
                        style={styles.input}
                    />
                    <Text style={styles.coverDate}>{onFormatDate()}</Text>
                    <View style={styles.photoButtonsContainer}>
                        <TouchableOpacity style={[styles.photoButton, {marginRight: 10}]}
                                          onPress={() => takePhoto(false)}>
                            <Text style={styles.photoButtonText}>Choose Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoButton} onPress={() => takePhoto(true)}>
                            <Text style={styles.photoButtonText}>Take Photos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <MaterialIcons name="event" size={24} color="white"/>
                    <Text style={styles.detailText}>Ending</Text>
                    <Text style={styles.detailSubText}>{format(endDate, 'eee, MMM d, yyyy hh:mm a')}</Text>
                    <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
                        <MaterialIcons name="edit" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.detailRow}>
                    <MaterialIcons name="timer" size={24} color="white"/>
                    <Text style={styles.detailText}>Reveal Photo</Text>
                    <TouchableOpacity onPress={() => setTimeAfter(!timeAfter)}>
                        <Text
                            style={styles.detailSubText}>{afterTime ? `${afterTime} hours after` : 'Select hours after'}</Text>
                    </TouchableOpacity>
                    {timeAfter && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            minimumDate={new Date()}
                            is24Hour={true}
                            display="default"
                            onChange={(val) => {
                                const hours = timestampToHours(val.nativeEvent.timestamp);
                                if (hours) {
                                    setTimeAfter(false);
                                    setAfterTime(Number(hours));
                                }
                            }}
                        />
                    )}
                </View>
                <View style={styles.detailRow}>
                    <MaterialIcons name="photo" size={24} color="white"/>
                    <Text style={styles.detailText}>Photos per Person</Text>
                    <Picker
                        selectedValue={selectedPhotos}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedPhotos(itemValue)}
                    >
                        <Picker.Item label="5 Photos" value="5"/>
                        <Picker.Item label="10 Photos" value="10"/>
                        <Picker.Item label="15 Photos" value="15"/>
                        <Picker.Item label="20 Photos" value="20"/>
                    </Picker>
                </View>
                <Text style={styles.detailSubText}>{selectedPhotos} Photos</Text>
                <View style={styles.detailRow}>
                    <MaterialIcons name="visibility" size={24} color="white"/>
                    <Text style={styles.detailText}>Guests can view gallery</Text>
                    <Switch
                        value={isGalleryViewable}
                        onValueChange={(value) => setIsGalleryViewable(value)}
                        trackColor={{false: "#767577", true: "#81b0ff"}}
                        thumbColor={isGalleryViewable ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>
                {isGalleryViewable && (
                    <View style={styles.detailRow}>
                        <MaterialIcons name="people" size={24} color="white"/>
                        <Text style={styles.detailText}>Guests per Person</Text>
                        <Picker
                            selectedValue={totalGuests}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedGuests(itemValue)}
                        >
                            <Picker.Item label="10 Guests" value="10"/>
                            <Picker.Item label="25 Guests" value="25"/>
                            <Picker.Item label="50 Guests" value="50"/>
                            <Picker.Item label="100 Guests" value="100"/>
                            <Picker.Item label="175 Guests" value="175"/>
                            <Picker.Item label="250 Guests" value="250"/>
                        </Picker>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.addPhotoButton} onPress={onSaveMemory}>
                <Text style={styles.addPhotoButtonText}>
                    {(selectedImage && selectedImage.length) ? (route?.key ? 'Update' : 'Continue') : 'Add a Photo to Continue'}
                </Text>
            </TouchableOpacity>
            {onRenderEnding()}
        </ScrollView>
    );
}


