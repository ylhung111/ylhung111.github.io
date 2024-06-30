Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  }
);
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
}
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
    const INFORMANTS = [...document.querySelectorAll('.informant>span>input')].filter(isChecked);
    let isPatient = false, isMR = false;
    for (index in INFORMANTS) {
        console.log(INFORMANTS[index])
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
function checkFormatting (checkbox) {
    var select = checkbox.nextElementSibling.nextElementSibling;
    select.disabled = !select.disabled;
};
function checkAllergy (checkbox) {
    var table = checkbox.nextElementSibling.nextElementSibling;
    if (checkbox.checked) {
        table.style.display = 'none';
    } else {
        table.style.display = 'table';
    };
};
function addAllergyRows (btn) {
    const TABLE = btn.parentNode.parentNode.parentNode.parentNode;
    const TBODY = TABLE.getElementsByTagName('tbody')[0];
    const tr = document.createElement('tr'),
          input = document.createElement('input'),
          button = document.createElement('button');
    input.setAttribute('type', 'text');
    button.setAttribute('type', 'button');
    button.setAttribute('onclick', 'Javascript:removeAllergyRows(this);');
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
function removeAllergyRows (btn) {
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
    if (document.getElementById('is-history-taken-by-student').checked) {
        outputString += 'History taken by ';
        outputString += document.getElementById('student-name').value;
        outputString += ', revised by ';
        outputString += document.getElementById('supervisor-name').value;
        outputString += '\n\n';
    }
    const PRESENT_ILLNESS_TEXT = document.getElementById('present-illness-input').value;
    outputString += '\[Present Illness\]\n';
    outputString += PRESENT_ILLNESS_TEXT;
    outputString += '\n\n';
    outputString += '\[Past History\]\n';
    document.getElementById('brief-history-output').textContent = outputString;
};
