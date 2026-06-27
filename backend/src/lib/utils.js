import jwt from "jsonwebtoken";

export const generateToken = (userId , res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,//in ms // so after 7 days user have to login again
        httpOnly:true,  //so that not accesible by js
        sameSite:"strict",
        secure:process.env.NODE_ENV==="production" //localhost http is not secure but in productiion is should be swcure https
    });
    return token;
};


//the important thing



// फ़ीचर (Feature)Cookies (कूकी)
// LocalStorage (लोकल स्टोरेज)

// सर्वर से कनेक्शनहर बार जब ऐप कोई पेज रिक्वेस्ट करते हैं, तो कूकी अपने आप (Automatically) सर्वर के पास चली जाती है।
// यह कभी भी अपने आप सर्वर के पास नहीं जाता। इसके डेटा को केवल जावास्क्रिप्ट की मदद से ही पढ़ा जा सकता है।
// 
// साइज लिमिट (Size)यह बहुत छोटी होती है। इसमें केवल 4 KB तक का ही डेटा सेव हो सकता है।
// इसकी क्षमता बहुत ज़्यादा होती है। इसमें ऐप 5 MB से 10 MB तक का डेटा रख सकते हैं।
// 
// एक्सपायरी (Expiry)ऐप इसका एक एक्सपायरी टाइम सेट कर सकते हैं (जैसे: 1 दिन बाद या 1 महीने बाद यह अपने आप डिलीट हो जाएगी)।
// यह कभी अपने आप डिलीट नहीं होती। जब तक यूज़र खुद ब्राउज़र का कैशे (Cache) क्लियर न करे या कोड से डिलीट न किया जाए, यह बनी रहेगी।
// 
// सुरक्षा (Security)इसमें HttpOnly और Secure फ्लैग्स होते हैं, जिससे हैकर्स जावास्क्रिप्ट के ज़रिए इसे चुरा नहीं सकते। इसलिए यह ज़्यादा सुरक्षित है।
// इसे जावास्क्रिप्ट कोड से आसानी से पढ़ा जा सकता है। इसलिए अगर वेबसाइट पर कोई XSS (Cross-Site Scripting) हमला हो, तो इसमें रखा डेटा चोरी हो सकता है।
// 
// मुख्य उपयोगयूज़र का Login Session, JWT टोकन या ऑथेंटिकेशन संभालने के लिए।
// यूज़र की पसंद की चीजें जैसे UI Theme (Dark/Light mode), शॉपिंग कार्ट का सामान, या फॉर्म का ड्राफ्ट सेव करने के लिए।
