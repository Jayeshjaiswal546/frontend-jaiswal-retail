exports.success = (toast,message)=>{
    toast.dismiss();
    toast.success(message);
};

exports.error = (toast,message)=>{
    toast.dismiss();
    toast.error(message);
}; 

exports.inform = (toast,message)=>{
    toast.dismiss();
    toast.info(message);
};

exports.warn = (toast,message)=>{
    toast.dismiss();
    toast.warning(message);
};