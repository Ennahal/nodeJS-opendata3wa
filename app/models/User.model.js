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
        //required: [true, 'le chanp email est requis'], 
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
    
    githubId: { type: String },
    avatarUrl: { type: String }

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
 
UserSchema.statics.signupViaGithub = function(profile) {

    // Recherche si cet utilisateur (loggué via Github) n'est pas déjà dans notre base mongo ?
    return this.findOne({ 'githubId' : profile.id })
        .then(user => {
            // Non ! Donc on l'inscrit dans notre base..
            if (user === null) {
                if (!profile.displayName) {
                    profile.displayName = 
                        ['kiwi','orange','abricot','banane'][~~(Math.random()*4)] + " " + (~~(Math.random() * 999 - 100)+100)
                }
                const [firstname, lastname] = profile.displayName.split(' ');
                return this.create({
                    githubId : profile.id,
                    firstname : firstname || '',
                    lastname : lastname || '',
                    avatarUrl : profile.photos[0].value // Photo par défaut de l'user Github
                });
            }
            // On renvoie l'utilisateur final
            return user;
        });
}
        


// Export du ModÃ¨le mongoose reprÃ©sentant un objet User
module.exports = mongoose.model('User', UserSchema);