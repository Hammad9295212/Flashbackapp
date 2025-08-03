import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {onLoginFB, onRegisterFB, onSubmitFB, tables, onGet} from "../Shared/CommonService";

const Login = ({navigation}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onRefresh();
    });

    const onRefresh = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            navigation.navigate("Tab");
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            let acc;
            if (isCreating) {
                if (!name || !email || !password) {
                    Alert.alert('Missing fields', 'All fields are required');
                    return;
                }
                acc = await onRegisterFB(email, password);
                if (acc?.error) {
                    Alert.alert('Failed', e?.msg || 'Something went wrong');
                    return;
                }
                const obj = {
                    name,
                    email,
                    userKey: acc?.user?.uid
                };
                const res = await onSubmitFB(obj, tables?.users, null, null, acc?.user?.uid);
                if (res?.error) {
                    Alert.alert('Failed', res?.msg || 'Something went wrong');
                    return;
                }
                setIsCreating(false);
                setName('');
                setEmail('');
                setPassword('');
                Alert.alert('Success', 'Account has been created. Please login');
                return;
            }

            acc = await onLoginFB(email, password);
            if (acc?.error) {
                Alert.alert('Failed', acc?.msg || 'Something went wrong');
                return;
            }

            const userObj = await onGet(tables?.users, null, acc?.user?.uid);

            if (!userObj || !userObj[0]) {
                Alert.alert('Failed', userObj?.msg || 'Something went wrong');
                return;
            }
            setName('');
            setEmail('');
            setPassword('');
            const userData = {
                ...userObj[0]?.data,
                userKey: acc?.user?.uid,
                key: userObj[0]?.key
            };
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            navigation.replace("Tab");
        } catch (e) {
            console.log(`---------------------e-`);
            console.log(e);
            Alert.alert('Failed', e?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#00ff00"/>
            </View>
        )
    } else {
        return (
            <ScrollView>
                <View style={{flex: 1, height: Dimensions.get("window").height, backgroundColor: "#13140F"}}>

                    <ScrollView>
                        <Image
                            source={require("../assets/Login.jpg")}
                            style={{
                                height: 407,
                                width: "97%",
                                alignSelf: "center"
                            }}
                            resizeMode="contain"
                        />
                        <View/>
                        <Image
                            source={require("../assets/Longlogo.png")}
                            style={{
                                height: 66,
                                alignSelf: "center"
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontSize: 17, color: "grey", textAlign: "center",
                                marginTop: 20, fontWeight: "600"
                            }}
                        >
                            Capture events from
                        </Text>
                        <Text
                            style={{
                                fontSize: 17, color: "grey", textAlign: "center",
                                marginTop: 0, fontWeight: "600"
                            }}
                        >
                            multiple perspectives.
                        </Text>
                        {isCreating ? (
                            <>
                                <TextInput
                                    placeholder="Name"
                                    placeholderTextColor="grey"
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />
                                <TextInput
                                    placeholder="Email"
                                    placeholderTextColor="grey"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="grey"
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TouchableOpacity onPress={handleSubmit}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>
                                            Register
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsCreating(false)}>
                                    <Text style={styles.switchText}>
                                        Already have an account? Sign in
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    placeholder="Email"
                                    placeholderTextColor="grey"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="grey"
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TouchableOpacity onPress={handleSubmit}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>
                                            Sign in
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsCreating(true)}>
                                    <Text style={styles.switchText}>
                                        Don't have an account? Register
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <Text
                            style={{
                                fontSize: 12, color: "grey", alignSelf: "center",
                                fontWeight: "600", position: "absolute", bottom: 20
                            }}
                        >
                            By signing in, you agree to our terms and conditions
                        </Text>

                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
};

const styles = {
    input: {
        width: "90%",
        height: 50,
        borderRadius: 10,
        backgroundColor: "#fff",
        alignSelf: "center",
        paddingLeft: 20,
        marginTop: 10,
        color: "#000",
    },
    button: {
        width: "90%",
        height: 60,
        borderRadius: 10,
        backgroundColor: "#fff",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    buttonText: {
        fontSize: 15,
        color: "grey",
        textAlign: "center",
        fontWeight: "600"
    },
    switchText: {
        fontSize: 15,
        color: "grey",
        textAlign: "center",
        marginTop: 20,
        fontWeight: "600",
        textDecorationLine: "underline"
    }
};

export default Login;
