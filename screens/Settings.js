import React, {useState} from "react";
import {View, Text, TouchableOpacity, TextInput, ScrollView, Image, Dimensions} from "react-native";
// import { Feather } from '@expo/vector-icons';
import {Fontisto} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import {FontAwesome6} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({navigation}) => {

    return (
        <ScrollView>
            <View style={{flex: 1, height: Dimensions.get("window").height, backgroundColor: "#13140F"}}>
                <View style={{height: 50}}/>

                <View

                    style={{
                        // flexDirection:"row",
                        width: "90%",
                        alignSelf: "center",
                        // justifyContent: "space-between"
                    }}
                >
                    <View

                        style={{
                            flexDirection: "row",
                            width: "100%",
                            alignSelf: "center",
                            justifyContent: "space-between"
                        }}
                    >


                        <Text
                            style={{
                                fontSize: 20, fontWeight: "500", color: "#fff"
                            }}
                        >
                            Settings
                        </Text>


                    </View>
                    <View style={{height: 20}}/>
                    <Text
                        style={{
                            fontSize: 18, fontWeight: "500", color: "#7A7B73"
                        }}
                    >
                        Help
                    </Text>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Feather name="message-circle" size={22} color="#fff"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Text Support
                        </Text>
                    </View>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MaterialCommunityIcons name="email-outline" size={22} color="white"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Email Support
                        </Text>
                    </View>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            borderBottomWidth: 1, borderBottomColor: "#7A7B73"
                        }}
                    />

                    <View style={{height: 20}}/>
                    <Text
                        style={{
                            fontSize: 18, fontWeight: "500", color: "#7A7B73"
                        }}
                    >
                        Follow us
                    </Text>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <FontAwesome6 name="instagram" size={22} color="#fff"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Instagram
                        </Text>
                    </View>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <AntDesign name="twitter" size={22} color="white"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Twitter
                        </Text>
                    </View>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            borderBottomWidth: 1, borderBottomColor: "#7A7B73"
                        }}
                    />

                    <View style={{height: 20}}/>
                    <Text
                        style={{
                            fontSize: 18, fontWeight: "500", color: "#7A7B73"
                        }}
                    >
                        Legal
                    </Text>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MaterialIcons name="policy" size={22} color="#fff"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Privacy Policy
                        </Text>
                    </View>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MaterialIcons name="policy" size={22} color="#fff"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Terms and Conditions
                        </Text>
                    </View>
                    <View style={{height: 20}}/>
                    <TouchableOpacity
                        onPress={async () => {
                            await AsyncStorage?.clear();
                            navigation.navigate("Login");
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <AntDesign name="logout" size={22} color="#fff"/>
                        <Text
                            style={{
                                fontSize: 16, fontWeight: "400", color: "#fff", marginLeft: 10
                            }}
                        >
                            Logout
                        </Text>
                    </TouchableOpacity>
                    <View style={{height: 20}}/>
                    <View

                        style={{
                            borderBottomWidth: 1, borderBottomColor: "#7A7B73"
                        }}
                    />
                </View>


            </View>
        </ScrollView>
    );
};

export default Settings;
