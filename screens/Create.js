import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Dimensions } from "react-native";
import { Feather } from '@expo/vector-icons';

const Create = ({ navigation }) => {
    const [text, setText] = useState("");

    const isButtonDisabled = text.trim().length === 0;

    return (
        <ScrollView>
            <View style={{ flex: 1, height: Dimensions.get("window").height, backgroundColor: "#13140F" }}>
                <Image
                    source={require("../assets/imgmain.jpg")}
                    style={{
                        height: 407,
                        width: "97%",
                        alignSelf: "center"
                    }}
                    resizeMode="contain"
                />
                <View style={{}} />
                <Image
                    source={require("../assets/Longlogo.png")}
                    style={{
                        height: 66,
                        alignSelf: "center"
                    }}
                    resizeMode="contain"
                />
                <View style={{ height: 30 }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, width: "90%", alignSelf: "center", borderRadius: 10, backgroundColor: "#292A24", paddingHorizontal: 10 }}>
                    <Feather name="edit-2" size={24} color="white" />
                    <TextInput
                        style={{
                            flex: 1,
                            height: 60,
                            color: "white",
                            marginLeft: 10
                        }}
                        placeholder="Enter text"
                        placeholderTextColor="#999"
                        value={text}
                        onChangeText={setText}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setText('');
                        navigation.navigate("photo", { title: text });
                    }}
                    disabled={isButtonDisabled}
                >
                    <View
                        style={{
                            width: "90%",
                            height: 60,
                            borderRadius: 10,
                            backgroundColor: isButtonDisabled ? "#292A24" : "#fff",
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: isButtonDisabled ? "#fff" : "grey",
                                textAlign: "center",
                                fontWeight: "600"
                            }}
                        >
                            {isButtonDisabled ? "Add a Name to Get Started" : "Continue"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Create;
