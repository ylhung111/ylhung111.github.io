Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  }
);
function uniqueArray (arr) {
    var seen = {};
    var out = [];
    var len = arr.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = arr[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         };
    };
    return out;
};
function isChecked (checkbox) {
    return checkbox.checked
};
function copyText (btn) {
    const copyTextarea = btn.nextElementSibling.nextElementSibling.nextElementSibling;
    copyTextarea.select();
    copyTextarea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyTextarea.value.trim());
    btn.nextElementSibling.textContent = 'Copied!';
};
function loadToday () {
    document.getElementById('admission-date').value = new Date().toISOString().substring(0, 10);
};
function chiefComplaint () {
    var outputString = new String();
    const PAT_SEX = document.querySelector('input[name="patient-sex"]:checked')
    const SEX = (!!PAT_SEX)? PAT_SEX.value: null;
    var possessive = new String();
    switch (SEX) {
        case 'm':
            possessive = 'his';
            break;
        case 'f':
            possessive = 'her';
            break;
        default:
            possessive = 'their';
    };
    const INFORMANTS = [...document.querySelectorAll('.informant input')].filter(isChecked);
    let isPatient = false, isMR = false;
    for (index in INFORMANTS) {
        if (INFORMANTS[index].value === 'patient') {
            isPatient = true;
        } else if (INFORMANTS[index].value === 'medical records') {
            isMR = true;
        };
    };
    var outputArr = new Array();
    if (isPatient) {
        INFORMANTS.shift();
        outputArr.push('patient');
    };
    if (isMR) {
        INFORMANTS.shift();
    };
    function addNodeValue (node, index) {
        if (isPatient && index === 0) {
            outputArr.push(possessive + ' ' + node.value);
        } else if (index === 0) {
            outputArr.push('patient\'s ' +node.value);
        } else {
            outputArr.push(node.value);
        }
        return 0;
    };
    INFORMANTS.forEach(addNodeValue);
    if (isMR) {
        outputArr.push('medical records');
    };
    switch (outputArr.length) {
        case 1:
            outputString = outputArr[0];
            break;
        case 2:
            outputString = outputArr.join(' and ');
            break;
        default:
            var arrLast = outputArr.pop();
            outputString = outputArr.join(', ');
            outputString += ', and ' + arrLast;
    }
    const CCOUTPUT = document.getElementById('chief-complaint-output'),
          REFERRAL = document.getElementById('referred-hospital').value;
    CCOUTPUT.textContent = 'Informant: ';
    CCOUTPUT.textContent += outputString.capitalize();
    if (!!REFERRAL) {
        CCOUTPUT.textContent += '\nReferred from ';
        CCOUTPUT.textContent += document.getElementById('referred-hospital').value;
    }
    CCOUTPUT.textContent += '\n';
    CCOUTPUT.textContent += document.getElementById('chief-complaint-input').value;
};
function checkTable (checkbox) {
    var table = checkbox.nextElementSibling.nextElementSibling;
    if (checkbox.checked) {
        table.style.display = 'none';
    } else {
        table.style.display = 'table';
    };
};
function addTableRows (btn) {
    const TABLE = btn.parentNode.parentNode.parentNode.parentNode;
    const TBODY = TABLE.getElementsByTagName('tbody')[0];
    const tr = document.createElement('tr'),
          input = document.createElement('input'),
          button = document.createElement('button');
    input.setAttribute('type', 'text');
    button.setAttribute('type', 'button');
    button.setAttribute('onclick', 'Javascript:removeTableRows(this);');
    button.appendChild(document.createTextNode('-'));
    for (var i = 0; i < 3; i += 1) {
        const td = document.createElement('td');
        if (i === 2) {
            td.innerHTML = button.outerHTML;
        } else {
            td.innerHTML = input.outerHTML;
        };
        tr.appendChild(td);
    };
    TBODY.appendChild(tr);
};
function removeTableRows (btn) {
    const ROW = btn.parentNode.parentNode;
    const TBODY = ROW.parentNode;
    TBODY.removeChild(ROW);
};
function checkHabits (checkbox) {
    var next = checkbox.nextElementSibling;
    while (next) {
        if (next.tagName.toLowerCase() === 'input') {
            if (checkbox.checked) {
                next.disabled = false;
            } else {
                next.disabled = true;
            };
        };
        next = next.nextElementSibling;
    };
};
function briefHistory () {
    var outputString = new String();
    // "History taken by ..."
    if (document.getElementById('is-history-taken-by-student').checked) {
        outputString += 'History taken by ';
        outputString += document.getElementById('student-name').value;
        outputString += ', revised by ';
        outputString += document.getElementById('supervisor-name').value;
        outputString += '\n\n';
    };
    // Get present illness
    const PRESENT_ILLNESS_TEXT = document.getElementById('present-illness-input').value;
    // Write present illness
    outputString += '\[Present Illness\]\n';
    outputString += PRESENT_ILLNESS_TEXT;
    outputString += '\n\n';
    // Set past history bullets
    const bullets = new Array(), 
        formatBullets = document.getElementsByClassName('ph-format-settings')[0].getElementsByTagName('select');
    for (var i in Object.keys(formatBullets)) { bullets.push({'shape': formatBullets[i].value, 'count': 0}); };
    // Set indentation
    const INDENT = parseInt(document.getElementById('ph-indent').value);
    // Get past medical history
    var arrPastMedicalHistory = new Array(), 
        nodePastMedicalHistory = document.getElementsByClassName('ph-past-medical-history')[0].querySelectorAll('input[id^=pmh-]')
    for (var i in Object.keys(nodePastMedicalHistory)) {
        if (nodePastMedicalHistory[i].checked === true) {
            arrPastMedicalHistory.push(nodePastMedicalHistory[i].value);
        };
    };
    // Write past medical history
    outputString += '\[Past History\]\n';
    bullets[0]['count'] += 1;
    outputString += bullets[0]['shape'].replace('0', bullets[0]['count'].toString());
    outputString += ' Past medical history: '
    if (arrPastMedicalHistory.length) {
        outputString += arrPastMedicalHistory.join(' (+), ');
        outputString += ' (+)\n';
    } else {
        outputString += 'no known history of systemic disease.\n';
    };
    // Get current medication
    var arrCurrentMedication = new Array();
        nodeCurrentMedication = document.getElementsByClassName('ph-current-medication')[0].getElementsByTagName('textarea');
    for (var i in Object.keys(nodeCurrentMedication)) {
        if (nodeCurrentMedication[i].value === undefined) {
            arrCurrentMedication.push('');
        } else {
            arrCurrentMedication.push(nodeCurrentMedication[i].value.trim());
        };
    };
    // Write current medication
    bullets[0]['count'] += 1;
    outputString += bullets[0]['shape'].replace('0', bullets[0]['count'].toString());
    outputString += ' Current medication: \n';
    for (var i = 0; i < arrCurrentMedication.length; i += 1) {
        for (var _ = 0; _ < INDENT; _ += 1) { outputString += ' ' };
        bullets[1]['count'] += 1;
        outputString += bullets[1]['shape'].replace('0', bullets[1]['count'].toString());
        outputString += ' ';
        switch (i) {
            case 0:
                outputString += 'NTUH: ';
                break;
            case 1:
                outputString += 'Others: ';
                break;
            case 2:
                outputString += 'Herbal medicine: ';
                break;
            case 3:
                outputString += 'Health supplements: ';
                break;
        };
        if (arrCurrentMedication[i] === '') {
            outputString += 'denied'
            outputString += '\n';
            continue;
        };
        var arrMedications = uniqueArray(arrCurrentMedication[i].split('\n'));
        outputString += '\n';
        for (var j = 0; j < arrMedications.length; j += 1) {
            for (var k = 0; k < INDENT * 2; k += 1) { outputString += ' ' };
            bullets[2]['count'] += 1;
            outputString += bullets[2]['shape'].replace('0', bullets[2]['count'].toString());
            outputString += ' ';
            outputString += arrMedications[j];
            outputString += '\n';
        };
        bullets[2]['count'] = 0;
    };
    bullets[1]['count'] = 0;
    // Get allergies
    var arrAllergyDrugs = new Array(),
        arrAllergyMaterials = new Array(),
        isAllergyDrugsDenied = document.getElementById('ph-is-allergy-drugs-denied').checked,
        isAllergyMaterialsDenied = document.getElementById('ph-is-allergy-materials-denied').checked;
    if (!isAllergyDrugsDenied) {
        var nodeAllergyDrugs = document.getElementById('ph-allergy-drugs-table').getElementsByTagName('input');
        var arrAllergyDrugsRaw = new Array();
        for (i in Object.keys(nodeAllergyDrugs)) {
            arrAllergyDrugsRaw.push(nodeAllergyDrugs[i].value.trim());
        };
        arrAllergyDrugs = arrAllergyDrugsRaw.filter(Boolean);
    };
    if (!isAllergyMaterialsDenied) {
        var nodeAllergyMaterials = document.getElementById('ph-allergy-materials-table').getElementsByTagName('input');
        var arrAllergyMaterialsRaw = new Array();
        for (i in Object.keys(nodeAllergyMaterials)) {
            arrAllergyMaterialsRaw.push(nodeAllergyMaterials[i].value.trim());
        };
        arrAllergyMaterials = arrAllergyMaterialsRaw.filter(Boolean);
    };
    // Write allergies
    bullets[0]['count'] += 1;
    outputString += bullets[0]['shape'].replace('0', bullets[0]['count'].toString());
    outputString += ' Allergy: \n';
    for (var _ = 0; _ < INDENT; _ += 1) { outputString += ' ' };
    bullets[1]['count'] += 1;
    outputString += bullets[1]['shape'].replace('0', bullets[1]['count'].toString());
    outputString += ' Food and drug allergies: ';
    if (isAllergyDrugsDenied || !arrAllergyDrugs.length) {
        outputString += 'denied\n';
    } else {
        outputString += '\n';
        for (i = 0; i < arrAllergyDrugs.length; i += 2) {
            for (var _ = 0; _ < INDENT * 2; _ += 1) { outputString += ' ' };
            bullets[2]['count'] += 1;
            outputString += bullets[2]['shape'].replace('0', bullets[2]['count'].toString());
            outputString += ' ';
            outputString += arrAllergyDrugs[i].capitalize();
            outputString += ': ';
            outputString += arrAllergyDrugs[i+1];
            outputString += '\n';
        };
    };
    bullets[2]['count'] = 0;
    for (var _ = 0; _ < INDENT; _ += 1) { outputString += ' ' };
    bullets[1]['count'] += 1;
    outputString += bullets[1]['shape'].replace('0', bullets[1]['count'].toString());
    outputString += ' Allergy to medical device and materials: ';
    if (isAllergyMaterialsDenied || !arrAllergyMaterials.length) {
        outputString += 'denied\n';
    } else {
        outputString += '\n';
        for (i = 0; i < arrAllergyMaterials.length; i += 2) {
            for (var _ = 0; _ < INDENT * 2; _ += 1) { outputString += ' ' };
            bullets[2]['count'] += 1;
            outputString += bullets[2]['shape'].replace('0', bullets[2]['count'].toString());
            outputString += ' ';
            outputString += arrAllergyMaterials[i].capitalize();
            outputString += ': ';
            outputString += arrAllergyMaterials[i+1];
            outputString += '\n';
        };
    };
    bullets[1]['count'] = 0;
    document.getElementById('brief-history-output').textContent = outputString;
};
