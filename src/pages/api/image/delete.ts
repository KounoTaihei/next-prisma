import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export const deleteImage = async(imagePath: string) => {
    const start = imagePath.indexOf('%');
    const finish = imagePath.indexOf('?');

    const newString = imagePath.substring(start + 3, finish);

    const targetPath = 'images/' + newString;

    const deleteRef = ref(storage, targetPath);

    deleteObject(deleteRef).then(result => result).catch(err => {console.log(err)})
}