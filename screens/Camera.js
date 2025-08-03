import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';
import {Ionicons, MaterialIcons, Feather} from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {tables, checkValueExists} from "../Shared/CommonService";
import {BarCodeScanner} from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import {useNavigation} from "@react-navigation/native";
import {Chip} from 'react-native-paper';

const Camera = (props) => {

    const navigation = useNavigation();
    const [memories, setMemories] = useState([]);
    const [qrData, setQrData] = useState(null);
    const [qrCodeVisible, setQrCodeVisible] = useState(false);
    const [qrScannerVisible, setQrScannerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [currentUser, setUserKey] = useState(null);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#2C2C2E',
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
        },
        joinButton: {
            backgroundColor: 'blue',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
        },
        joinButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        hostingSection: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#ccc',
            marginBottom: 10,
        },
        cameraCard: {
            backgroundColor: '#2C2C2E',
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        cameraImage: {
            width: 60,
            height: 60,
            borderRadius: 10,
            marginRight: 15,
        },
        cameraInfo: {
            flex: 1,
        },
        cameraName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
        },
        cameraDuration: {
            color: '#ccc',
        },
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        actionButton: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            marginHorizontal: 5,
            borderRadius: 10,
            backgroundColor: 'black',
        },
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
        },
        centeredView2: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalText: {
            marginBottom: 15,
            textAlign: 'center',
        },
        closeButton: {
            backgroundColor: '#2196F3',
            borderRadius: 20,
            padding: 10,
            elevation: 2,
        },
        textStyle: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },

        modalView2: {
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: '90%',
        },
        barcodeScanner2: {
            width: '100%',
            height: 300,
            borderRadius: 20,
            overflow: 'hidden',
        },
        closeButton2: {
            backgroundColor: '#2196F3',
            borderRadius: 10,
            padding: 10,
            elevation: 2,
            marginTop: 20,
        },
        textStyle2: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });

    useEffect(() => {
        return props?.navigation?.addListener('focus', () => {
            try {
                onRefresh();
            } catch (e) {
                console.log(e);
            }
        });
    });

    const onRefresh = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);
            if (!user || !user?.key) {
                Alert.alert('Please login first');
                navigation.navigate('Login');
                return;
            }
            setUserKey(user?.userKey);
            let newMemories = [];
            const myMemories = await checkValueExists(tables?.memories, user?.userKey, 'createdBy');
            if (!myMemories || myMemories?.error) {
                return;
            }
            if (myMemories?.title) {
                newMemories.push(myMemories);
            } else if (myMemories && myMemories[0]) {
                newMemories = [...myMemories];
            }
            setMemories(newMemories);


            /*  const res = await onGet(tables?.memories, null, user?.userKey);
              if (res && res[0]) {

                  for (let i = 0; i < res?.length; i++) {
                      if (res[i]?.key) {
                          newMemories.push({...res[i]?.data, key: res[i]?.key});
                      }
                  }
                  setMemories(newMemories);
              }*/
            // let localMemories = await AsyncStorage.getItem('memories');
            // localMemories = localMemories ? JSON.parse(localMemories) : [];
            // setMemories(localMemories);
        } catch (e) {

        } finally {

        }
    }

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const onFindTotalGuests = (memory) => {
        if (!memory || !memory.userMemories || memory.userMemories.length === 0) {
            return 0;
        }
        return memory.userMemories.filter((item) => item.uploadedBy !== currentUser).length;
    };

    const handleBarCodeScanned = ({type, data}) => {
        try {
            if (!data) {
                return;
            }
            let obj = JSON.parse(data);
            if (!obj?.key) {
                Alert.alert('Something went wrong', 'This event cannot be joined at the moment');
                return;
            }
            if (!obj?.totalGuests) {
                Alert.alert('Guests not allowed', 'This event is not accepting guests at the moment');
                return;
            }
            if ((onFindTotalGuests() >= Number(obj?.totalGuests))) {
                Alert.alert('Guests limit reached', 'We\'ve reached the maximum number of guests allowed for this event.');
                return;
            }
            navigation.navigate('SnapView', {...obj, memoryIndex: obj?.key});
        } catch (e) {
            Alert.alert(e?.message || 'Something went wrong');
        } finally {
            setQrCodeVisible(false);
        }
    };

    const calculateTimeDifference = (endingDate) => {
        const now = new Date();
        const endDate = new Date(endingDate);
        const timeDifference = endDate - now;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        if (years > 0) {
            return `Ending in ${years} year${years > 1 ? 's' : ''}`;
        } else if (months > 0) {
            return `Ending in ${months} month${months > 1 ? 's' : ''}`;
        } else if (days === 0) {
            return "Ending today";
        } else if (days === 1) {
            return "Ending tomorrow";
        } else {
            if (days < 0) {
                return;
            }
            return `Ending in ${days} day${days > 1 ? 's' : ''}`;
        }
    }

    const renderQrCode = () => {
        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={qrCodeVisible}
                onRequestClose={() => {
                    setQrData(null);
                    setQrCodeVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <QRCode
                            value={JSON.stringify(qrData)}
                            size={280}
                            logoSize={30}
                            logoBackgroundColor='transparent'
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setQrData(null);
                                setQrCodeVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    const renderQrScanner = () => {
        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={qrScannerVisible}
                onRequestClose={() => {
                    setQrScannerVisible(false);
                }}
            >
                <View style={styles.centeredView2}>
                    <View style={styles.modalView2}>
                        <BarCodeScanner
                            onBarCodeScanned={handleBarCodeScanned}
                            style={styles.barcodeScanner2}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setQrScannerVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}
                    nestedScrollEnabled={true}
        >
            {
                renderQrCode()
            }
            {
                qrScannerVisible && renderQrScanner()
            }
            <View style={styles.header}>
                <Text style={styles.title}>Cameras</Text>
                <TouchableOpacity style={styles.joinButton}
                                  onPress={() => setQrScannerVisible(!qrScannerVisible)}
                >
                    <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
            </View>
            {
                loading ?
                    <>
                        <ActivityIndicator size="large" color="#00ff00"/>
                    </> :
                    <ScrollView contentContainerStyle={styles.hostingSection}>
                        <Text style={styles.sectionTitle}>Hosting</Text>
                        {
                            (!memories || memories?.length < 1) &&
                            <Text style={{color: 'white'}}>No memories yet, create one? </Text>
                        }
                        {memories && memories?.map((memory, memoryIndex) => (
                            <View style={styles.cameraCard}
                                  key={memory?.images[0] + memory?.key}
                            >
                                <Image source={{
                                    uri: `https://i.ibb.co/${memory?.images[0]}/HA.png`
                                }} style={styles.cameraImage}/>
                                <View style={styles.cameraInfo}>
                                    <View style={{
                                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={styles.cameraName}>{memory?.title}</Text>
                                        {/*{memory?.images?.length &&
                                            <Text style={styles.cameraName}>Snaps Left: {memory?.images?.length}</Text>}
                                 */}
                                    </View>
                                    <Text style={styles.cameraDuration}>
                                        {calculateTimeDifference(memory?.endDate) ?
                                            <>
                                                {calculateTimeDifference(memory?.endDate)}
                                            </>
                                            : <Chip icon="information">Expired</Chip>}
                                    </Text>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity style={styles.actionButton}
                                                          onPress={() => {
                                                              if (calculateTimeDifference(memory?.endDate)) {
                                                                  navigation.navigate('SnapView', {
                                                                      ...memory,
                                                                      memoryIndex: memory?.key
                                                                  });
                                                              } else {
                                                                  Alert.alert(
                                                                      'Gallery View',
                                                                      'Gallery viw is not available for expired memories',
                                                                  );
                                                              }

                                                          }}
                                        >
                                            <Ionicons
                                                name={calculateTimeDifference(memory?.endDate) ? 'camera-outline' : 'image-outline'}
                                                size={24} color={'white'}/>
                                        </TouchableOpacity>
                                        {calculateTimeDifference(memory?.endDate) &&
                                            <TouchableOpacity style={styles.actionButton}
                                                              onPress={() => {
                                                                  navigation.navigate("photo", {
                                                                      ...memory
                                                                  })
                                                              }}
                                            >
                                                <MaterialIcons name="edit" size={24} color={'white'}/>
                                            </TouchableOpacity>}
                                        <TouchableOpacity style={styles.actionButton}>
                                            <Feather name="share" size={24} color={'white'}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton}
                                                          onPress={() => {
                                                              setQrData(memory);
                                                              setQrCodeVisible(!qrCodeVisible);
                                                          }}
                                        >
                                            <Ionicons name="qr-code-outline" size={24} color={'white'}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
            }
        </ScrollView>
    );
};

export default Camera;
