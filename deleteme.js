
onload = function(){
    // console.log(`terminal working inside onload`)
    
    const links = Array.from(document.querySelectorAll('a'));
    const urls = links.map(function(a) { return a.href;});
    
    for (let ea of urls){
        console.log(ea)
    }


};



let number = [2,4,6,7,8,10];

let output = number.map(num => {
    if (num%2 == 0){return num}
    return;
});

// console.log(output)