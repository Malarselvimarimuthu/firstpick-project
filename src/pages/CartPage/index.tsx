import React, {useState} from 'react';
import app from "../../firebase/firebaseConfig";
import { getDatabase, ref, set, push } from 'firebase/database';
import { FirebaseStorage, getStorage, uploadBytes } from 'firebase/storage'; 
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';

// const storage: FirebaseStorage = getStorage(app); 
// const firestore: Firestore = getFirestore(app);

function Write()
{
    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValue2] = useState("");

    const saveData = async() => {
        const db=getDatabase(app);
        const newDocRef = push(ref(db, "nature/fruit"));
        set(newDocRef, {
            fruitName: inputValue1,
            fruitDefinition: inputValue2
        }).then( ()=>{
            alert("data saved successfully")
        }).catch((error)=>{
            alert("error: ");
        })
    }
    return(
        <div className='mt-40'>
            <input type="text" value={inputValue1}
            onChange={(e)=> setInputValue1(e.target.value)}/>

            <input type="text" value={inputValue2}
            onChange={(e)=> setInputValue2(e.target.value)}/> <br/>

            <button onClick={saveData}>SAVE DATA</button>

        </div>
    )
}

export default Write;





