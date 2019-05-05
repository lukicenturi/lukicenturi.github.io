class Line {
    constructor(id, nodeA, nodeB, partA, partB){
        this.object = $(`
            <line id="line-${id}" data-id="${id}"></line>
        `);
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.partA = partA;
        this.partB = partB;

        svg.children('g').removeClass('animate');
        svg.append(this.object).html(svg.html());

        this.id = id;
        this.selector = `#line-${this.id}`;

        this.update(1);
    }

    update() {
        let x1 = this.nodeA.x;
        let y1 = this.nodeA.y;

        let x2 = this.nodeB.x;
        let y2 = this.nodeB.y;

        if(this.partA === 1) { y1 -= r}
        else if(this.partA === 2) { x1 += r}
        else if(this.partA === 3) { y1 += r}
        else if(this.partA === 4) { x1 -= r}

        if(this.partB === 1) { y2 -= r}
        else if(this.partB === 2) { x2 += r}
        else if(this.partB === 3) { y2 += r}
        else if(this.partB === 4) { x2 -= r}

        $(this.selector)[0].setAttributeNS(null, 'x1', x1);
        $(this.selector)[0].setAttributeNS(null, 'y1', y1);
        $(this.selector)[0].setAttributeNS(null, 'x2', x2);
        $(this.selector)[0].setAttributeNS(null, 'y2', y2);
        //
        // if(special) {
        //     let dist = Math.hypot(x1 - x2, y1 - y2);
        //     console.log($(this.selector).css('stroke-dasharray'));
        //     $(this.selector).css('stroke-dasharray', `${dist} 10000`);
        // }
    }
}