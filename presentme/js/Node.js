class Node {
    constructor(x, y, id) {
        this.object = $(`
            <g class="node animate" id="node-${id}" data-id="${id}">
                <g>
                    <circle class="draggable"/>
                    <path class="draggable" data-connect="0" data-part="1"></path>
                    <text>1</text>
                    <path class="draggable" data-connect="0" data-part="2"></path>
                    <text>2</text>
                    <path class="draggable" data-connect="0" data-part="3"></path>
                    <text>3</text>
                    <path class="draggable" data-connect="0" data-part="4"></path>
                    <text>4</text>
                </g>
            </g>
        `);

        this.x = x;
        this.y = y;

        svg.children('g').removeClass('animate');
        svg.append(this.object).html(svg.html());

        this.id = id;
        this.selector = `#node-${this.id}`;
        this.relation = {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
        };
    }

    update(selectedNode, holdPath) {
        if(selectedNode == this.id || holdPath) {
            $(this.selector).addClass('active');
        }else {
            $(this.selector).removeClass('active');
        }

        for(let key in this.relation){
            $(this.selector).find(`path:nth-of-type(${key})`).attr('data-connect', this.relation[key] == null ? 0 : 1);
        }
        $(this.selector)[0].setAttributeNS(null, 'transform', `translate(${this.x}, ${this.y})`);
    }
}