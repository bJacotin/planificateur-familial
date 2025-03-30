import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "@/FirebaseConfig";
import {User,Family} from "@/types/user";
import {getDoc} from "@firebase/firestore";

export const useUserAndFamily = () => {
    const [user, setUser] = useState<User | null>(null);
    const [family, setFamily] = useState<Family| null>(null);

    useEffect(() => {

        const currentUser = FIREBASE_AUTH.currentUser;
        if (!currentUser) return;

        const userRef = doc(FIREBASE_FIRESTORE, "users", currentUser.uid);


        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();

                console.log(userData)
                const transformedUser: User = {
                    id: docSnap.id,
                    name: userData.name,
                    pp: (userData.ppPart1+userData.ppPart2+userData.ppPart3+userData.ppPart4+userData.ppPart5+userData.ppPart6) || null,
                    family: userData.families[0] || null
                };

                setUser(transformedUser);
                console.log("Maj user")
                if (userData.families[0]) {

                    const familyRef = doc(FIREBASE_FIRESTORE, "families", userData.families[0]);
                    const unsubscribeFamily = onSnapshot(familyRef, async (familySnap) => {
                        if (familySnap.exists()) {
                            const familyData = familySnap.data();


                            const membersData = await Promise.all(
                                (familyData.members || []).map(async (memberId: string) => {
                                    const memberRef = doc(FIREBASE_FIRESTORE, "users", memberId);
                                    const memberSnap = await getDoc(memberRef);
                                    if (memberSnap.exists()) {
                                        const memberData = memberSnap.data();
                                        return {
                                            id: memberSnap.id,
                                            name: memberData.name,
                                            pp: (memberData.ppPart1 + memberData.ppPart2 + memberData.ppPart3 + memberData.ppPart4 + memberData.ppPart5 + memberData.ppPart6) || null,
                                            family: userData.families[0]
                                        };
                                    } else {
                                        return null;
                                    }
                                })
                            );


                            const validMembers = membersData.filter((member) => member !== null);

                            const transformedFamily: Family = {
                                id: familySnap.id,
                                owner: familyData.owner,
                                members: validMembers as User[],
                                name: familyData.name,
                                request: familyData.request || null,
                            };

                            setFamily(transformedFamily);
                            console.log("Maj family");
                        } else {
                            setFamily(null);
                        }
                    });


                    return () => unsubscribeFamily();


                } else {
                    setFamily(null);
                }
            } else {
                setUser(null);
                setFamily(null);
            }
        });

        return () => unsubscribeUser();
    }, []);

    return { user, family };
};
