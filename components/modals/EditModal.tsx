'use client'
import useCurrentUser from "@/hooks/useCurrentUser"
import useEditModal from "@/hooks/useEditModel";
import useUser from "@/hooks/useUser";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";
const EditModal = () => {''

  const {data:user,mutate:mutateCurrent}=useCurrentUser();
  

  const editModal= useEditModal();

  const [profileImage,setProfileImage]=useState("");
  const [coverImage,setCoverImage]=useState("");
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [bio,setBio]=useState("");

  useEffect(() => {
    
    setProfileImage(user?.currentUser?.profileImage);
    setCoverImage(user?.currentUser?.coverImage);
    setName(user?.currentUser?.name);
    setUsername(user?.currentUser?.username);
    setBio(user?.currentUser?.bio);
  

  }, [user])
  
  const [isLoading,setisLoading]= useState(false);

  const onSubmit= useCallback(async()=>{
    try {
      setisLoading(true);

      await axios.put('/api/edit',{
        name,
        username,
        bio,
        profileImage,
        coverImage,
      });
      mutateCurrent();
      toast.success('Updated')
      editModal.onClose()
    } catch (error) {
      toast.error("Something went wrong");
    }finally{
      setisLoading(false);
    }
  },[name,username,bio,profileImage,coverImage,editModal,mutateCurrent])

  const bodyContent=(
    <div className="flex flex-col gap-4">
      <Input 
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input 
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />
      <Input 
        placeholder="Bio"
        onChange={(e)=>setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
      <ImageUpload
        value={profileImage}
        disabled={isLoading}
        //onChange stores the base64 string of the image
        onChange={(image)=>setProfileImage(image)}
        label='Upload profile image'
      />
      <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image)=>setCoverImage(image)}
        label='Upload cover image'
      />
    </div>
  )

  return (
    <Modal
      body={bodyContent}
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel='Save'
      onClose={editModal.onClose}
      onSubmit={onSubmit}
    />
  )
}

export default EditModal