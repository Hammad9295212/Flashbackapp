import React, {useState} from 'react';
import {View, Image, StyleSheet, Button, ScrollView} from 'react-native';



const ImageFilterComponent = ({selectedImage}) => {
    const [brightness, setBrightness] = useState(1);
    const [contrast, setContrast] = useState(1);
    const [saturation, setSaturation] = useState(1);
    const [filter, setFilter] = useState('');

    const handleApplyFilter = (filterType) => {
        setFilter(filterType);
    };

    return (
        <View style={styles.container}>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    filtersContainer: {
        marginTop: 20,
    },
});

export default ImageFilterComponent;
