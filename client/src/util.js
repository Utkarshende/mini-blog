const getCurrentUser=()=>{
    const user= localStorage.getItem("loggedInUser");
if(user){
    return JSON.parse(user);
}
else{
    return null;
}
};  

export {getCurrentUser};

