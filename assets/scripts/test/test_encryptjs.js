
const encrypt = require('encryptjs');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        var secretkey='408e5c63-4c22-4560-b94f-d0641712455e';
        var data=[{a: 3, xx: false}];
        var plaintext = JSON.stringify(data);
        var cipherText =encrypt.encrypt(plaintext,secretkey,256);
        console.log(cipherText+" ****************** ");
        var decipher=encrypt.decrypt(cipherText,secretkey,256);
        decipher = JSON.parse(decipher);
        console.log("Deciphered Text is : ", decipher);
        cc.log(decipher === data);


        cc.log('------------------- ');
        var text2 = 'false';
        try {
            text2 = encrypt.decrypt(text2,secretkey,256);
        } catch (error) {
            cc.log(error);
        }
        cc.log(text2);

        cc.log(JSON.parse('xxxfsafsdjk'));
    },

    
});
