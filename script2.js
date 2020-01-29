
var updating = { isUpdating: false, row: null, children: null};
var currentRow = null;

//Contient les contacts
var contacts = [];
//Index pour identifier les rangées
var i = 1;

//Objet contact
class Contact{
	mName;
	mPhone;
	mEmail;
	constructor(name = null, phone = null, email = null){
		this.mName = name;
		this.mPhone = phone;
		this.mEmail = email;
	}
}

//Formattage des tooltips
$(function() {
    $( document ).tooltip({
        position: {
            my: "center bottom-20",
            at: "right+5 top+10",
            using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" ).addClass( "arrow" )
                .addClass( feedback.vertical ).addClass( feedback.horizontal )
                .appendTo( this );
            }
        }
    });
});

//Mise-à-jour des données après ajout ou modification de contact
$("#Form-Insert").submit(function( event ) {
    var name = $('#InsertName').val();
    var telephone = $('#InsertTelephone').val();
    var email = $('#InsertEmail').val();

    if(validationProvider.isValid()) {
        if(updating.isUpdating){
            $(updating.row).children()[0].innerHTML = name;
            $(updating.row).children()[1].innerHTML = telephone;
            $(updating.row).children()[2].innerHTML = email;
            removeCurrentEdit();
        }
        else{
            insertContact(new Contact(name, telephone, email)); 
        }
        clearInputs();
        $("#Tableau-Controls").hide();
        $("#InsertShowButton").show();
    }         
});

//Insertion de contact dans le tableau
function insertContact(contact){
	if(contact.name != "" && contact.phone != "" && contact.email != "") {

        //Ajout du contact à la liste
		contacts.push(contact);
		console.log(contacts);

		let grid = $("#DataGrid");

        //Création du grid pour le contact
		let row = document.createElement("div");
		row.classList.add('grid-container');
		row.classList.add("row_" + i++);

		let name = document.createElement("div");
		let phone = document.createElement("div");
		let email = document.createElement("div");
		let ctrl = document.createElement("div");

		let j = 1;
		name.classList.add("cell_" + j++);
		phone.classList.add("cell_" + j++);
		email.classList.add("cell_" + j++);
		ctrl.classList.add("cell_" + j++);

		name.innerHTML = contact.mName;
		phone.innerHTML = contact.mPhone;
		email.innerHTML = contact.mEmail;

        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        editButton.classList.add('hide');
        deleteButton.classList.add('hide');
        editButton.innerHTML = '<i class="fa fa-pencil"></i>';
        deleteButton.style.marginLeft= '5px';
        deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
        ctrl.appendChild(editButton);
		ctrl.appendChild(deleteButton);

		row.append(name);		
		row.append(phone);
		row.append(email);
		row.append(ctrl);	


        //Servira à créer des capteur d'évènements
		let overlay_ = document.getElementById("Overlay");
        let back = document.getElementById("Wrapper");
        let popup_ = document.getElementById("Popup");

        let delAcceptBtn = document.getElementById("DeleteAcceptButton");
        let delDenyBtn = document.getElementById("DeleteDenyButton");	

        //Affichage des boutons modifier et supprimer en hover
		$(row).on('mouseover',  function(e) {
            $(this).find('button').show();
        });
            
        $(row).on('mouseout',  function(e) {
            $(this).find('button').hide();
        });

        //Pour les tooltips sur les boutons modifier et supprimer
        $(editButton).attr('title', 'Modifier ' + contact.mName);
        $(deleteButton).attr('title', 'Effacer ' + contact.mName);
       
        //Gestion des évènements pour la suppression et la modification
        $(deleteButton).on('click',  function(e) {
            currentRow = $(row);
            console.log(currentRow)
            overlay_.classList.add('show');
            popup_.classList.add('show');
            document.getElementById('ContactName').innerHTML = row.childNodes[0].innerHTML + "?";
            back.classList.add('disabled');
        });

        $(editButton).on('click',  function(e) {
            console.log("ok")
            updateData.children = $(row).parent().children();
            if(updateData.children != null)
                removeCurrentEdit();
            
            $(row).addClass('current-edit');
            updateData($(row));

        });

        //Gestion du formulaire de confirmation de suppression
        $(delAcceptBtn).on('click',  function(e) {
            console.log(row);
            overlay_.classList.remove('show');
            popup_.classList.remove('show');
            back.classList.remove('disabled'); 
            currentRow.remove();
            clearInputs(); 
            $("#Tableau-Controls").hide();
            $("#InsertShowButton").show();     
        });

        $(delDenyBtn).on('click',  function(e) {
            overlay_.classList.remove('show');
            popup_.classList.remove('show');
            back.classList.remove('disabled');             
        });

        //Ajout de la rangée au tableau
		grid.append(row);
	}
}

//Gestion de l'évèmement click pour ajout de contact
$("#InsertShowButton").click(function(event) {
    $("#Tableau-Controls").show();
    $(this).hide();
    validationProvider.reset();
});

//Gestion de l'évèmement click pour rafraichissement des champs d'ajout ou de modification
$("#ControlRefreshButton").click(function(event) {
    clearInputs();
    if(updateData.children != null)
        removeCurrentEdit();
        
    updateData.children = null;
});

//Gestion de l'évèmement click pour annulation de modification ou de suppression
$("#ControlCancelButton").click(function(event) {
    clearInputs();
    $("#Tableau-Controls").hide();
    $("#InsertShowButton" ).show();
    if(updateData.children != null)
        removeCurrentEdit();

    updateData.children = null;
});

function removeCurrentEdit() {
    for (let index = 0; index <  updateData.children.length; index++) {
        $(updateData.children[index]).removeClass('CurrentEdit');
    }
}

function updateData(row) {
    let nom = row.children()[0].innerHTML;
    let telephone = row.children()[1].innerHTML;
    let courriel = row.children()[2].innerHTML;
  
    let controlTab =  $("#Tableau-Controls");
    if(!controlTab.is(":visible")){
        controlTab.show();
        $("#InsertShowButton" ).hide();
    }

    validationProvider.reset();

    $('#InsertName').val(nom);
    $('#InsertTelephone').val(telephone);
    $('#InsertEmail').val(courriel);

    updating = {isUpdating: true, row: row};

}

function clearInputs() {
    $('#InsertName').val('');
    $('#InsertTelephone').val('');
    $('#InsertEmail').val('');
    updating = {isUpdating: false, row: null};
}

function removeCurrentEdit() {
    for (let index = 0; index <  updateData.children.length; index++) {
        $(updateData.children[index]).removeClass('current-edit');
    }
}

//Méthodes de validation
function validate_email(){
    let TBX_Email = document.getElementById("InsertEmail");
    let emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;

    if (!emailRegex.test(TBX_Email.value))
        return "Adresse de courriel invalide";

    return "";
}

function validate_name(){
    let TBX_FirstName = document.getElementById("InsertName");

    if (TBX_FirstName.value === "")
        return "Prénom manquant";
    
        
    var letters = /^[A-Za-z]+$/;

    if(!TBX_FirstName.value.match(letters))   
        return "Le nom doit seulement contenir des lettres"; 

    return "";
}

function validate_telephone(){
    let TBX_Phone = document.getElementById("InsertTelephone");

    if (TBX_Phone.value === "" )
        return "Téléphone manquant";
    if (!(TBX_Phone.value.length === 10 && $.isNumeric(TBX_Phone.value) && TBX_Phone.value > 0)) {
        return "Téléphone de format invalide";
    }
      
    return "";
}
//Validation provider
let validationProvider = new ValidationProvider("Form-Insert");

validationProvider.addControl("InsertName", validate_name);
validationProvider.addControl("InsertEmail", validate_email);
validationProvider.addControl("InsertTelephone", validate_telephone);

//Ajout de données bidons
insertContact(new Contact('Samuel', '1234567890', 'sam@outlook.com'));
insertContact(new Contact('Jean', '1234567890', 'jean.pierre@outlook.com'));
insertContact(new Contact('Audrey', '1234567890', 'audrey.vigneux@outlook.com'));