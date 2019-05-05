let r = 40;
let svg = $("#svg");

window.onload = () => {
    main = new Main();
}

function init() {
    main = new Main();
}

// function generate() {
//     let node1 = $("#node-1");
//
//     for(let i = 0 ; i < 4; i ++){
//         let y = r * Math.sin((i * 90 - 135) * Math.PI / 180);
//         let x = r * Math.cos((i * 90 - 135) * Math.PI / 180);
//
//         let y1 = r * Math.sin((i * 90 - 45) * Math.PI / 180);
//         let x1 = r * Math.cos((i * 90 - 45) * Math.PI / 180);
//
//         let a = (i % 2) ? (53 * (2 - i)) : 0;
//         let b = (i % 2) ? 0 : (53 * (i - 1));
//
//         let d = `M 0 0 L ${x} ${y} Q ${a} ${b}, ${x1} ${y1} Z`;
//
//         node1.find(`path:nth-of-type(${i + 1})`).attr('d', d);
//     }
// }
