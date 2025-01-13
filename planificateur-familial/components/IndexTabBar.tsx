import { Image, StyleSheet, Text, View } from "react-native";


const IndexTabBar = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.navBar}>
                <View style={styles.navBarItem}>
                    <Image
                        style={styles.homeIcon}
                        source={require("@/assets/images/homeIconPurple.png")}
                    />
                    <Text style={styles.navBarText}>Home</Text>
                </View>
                <View style={styles.navBarItem}>
                    <Image
                        style={styles.questIcon}
                        source={require("@/assets/images/questIconBlack.png")}
                    />
                    <Text style={styles.navBarText}>Quest</Text>
                </View>
                <View style={styles.navBarItem}>
                    <Image
                        style={styles.familyIcon}
                        source={require("@/assets/images/familyIconBlack.png")}
                    />
                    <Text style={styles.navBarText}>Family</Text>
                </View>
                <View style={styles.navBarItem}>
                    <Image
                        style={styles.settingsIcon}
                        source={require("@/assets/images/settingsIconBlack.png")}
                    />
                    <Text style={styles.navBarText}>Settings</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    homeIcon: {
        resizeMode: "contain",
        height: 32,
    },
    questIcon: {
        resizeMode: "contain",
        height: 32,
    },
    familyIcon: {
        resizeMode: "contain",
        height: 32,
    },
    settingsIcon: {
        resizeMode: "contain",
        height: 32,
    },
    navBar: {
        position: "absolute",
        bottom: 15,
        width: 350,
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    mainContainer: {
        flex: 1,
    },
    navBarText: {
        fontSize: 14,
        fontFamily: "Poppins_Medium",
    },
    navBarItem: {
        width: 80,
        display: "flex",
        alignItems: "center",
    },
});

export default IndexTabBar;