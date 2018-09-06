// Utilisation du module npm 'mongoose'
const mongoose = require('mongoose');

const hash = require('./../hash');

// DÃ©finition du "SchÃ©ma" d'un utilisateur
const UserSchema = mongoose.Schema({
	firstname : { type: String, required: [true, 'le chanp prenon est requis'] },
	lastname : { type: String, required:[true, 'le chanp non est requis']  },
    
    // Validateur personnalisÃ© qui vÃ©rifie le format d'une adresse e-mail.
    // BasÃ© sur la documentation de mongoose : http://mongoosejs.com/docs/validation.html#custom-validators 
    email : {
        type: String,
        required: [true, 'le chanp email est requis'], 
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide.'
        }
    },

    salt: { type: String },
    hash: { type: String },
    githubId: { type: String }

});

/*
    Ajout d'une méthode personnalisée "signup" pour inscrire un utilisateur via
    le formulaire d'inscription classique.
    Cette méthode accepte les 5 paramètres obligatoires définissant un User
*/
UserSchema.statics.signup = function (firstname, lastname, email, password, confirmPassword)
                            {
                                return hash(password).then(data =>{
                                    return this.create({
                                        'firstname': firstname,
                                        'lastname': lastname,
                                        'email': email,
                                        'hash': data.hash,
                                        'salt': data.salt
                                    })
                                })
                            };


/*
    Ajout de la méthode permettant de vérifier un mot de passe
*/

UserSchema.statics.verifyPass = function(passwordInClear, userObject) {
	const userSalt = userObject.salt;
    const userHash = userObject.hash;
    
    return hash(passwordInClear, userSalt).then((data) => {
    	if (data.hash === userHash) {
        	return Promise.resolve(userObject)
        } else {
        	return Promise.reject(new Error('Mot de passe invalide!'))
        }
    });
}

// Export du ModÃ¨le mongoose reprÃ©sentant un objet User
module.exports = mongoose.model('User', UserSchema);