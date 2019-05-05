class Main {
    constructor() {
        this.counter = 0;
        this.nodes = {};
        this.lines = {};
        this.holdNode = null;
        this.selectedNode = null;
        this.holdPath = null;
        this.holdMouse = false;
        this.offset = {
            x: 0,
            y: 0,
        };
        this.init();
    }

    init() {
        svg.attr({
            width: window.innerWidth - 20,
            height: window.innerHeight - 20
        });

        this.createNode();
        this.update();
        this.listener();
    }

    listener() {
        svg.on('mousedown', (e) => this.startDrag(e))
            .on('mousemove', (e) => this.drag(e))
            .on('mouseup', (e) => this.endDrag(e))
            .on('mouseleave', (e) => this.endDrag(e))
            .on('click', (e) => {
                if(this.holdMouse) this.holdMouse = false;
                else this.selectedNode = null;
            })
            .on('click', '.node', (e) => {
                e.stopPropagation();
                this.selectedNode = +e.currentTarget.getAttribute('data-id');
            })
    }

    getPathInfo(e) {
        let target = e.target;
        let node = +target.parentElement.parentElement.getAttribute('data-id');
        let part = +target.getAttribute('data-part');

        return [node, part];
    }

    createNode(node = null, part = null) {
        if (node && part) {
            let sourceNode = this.nodes[node];

            if (sourceNode.relation[part] !== null || this.holdNode) return;

            let x = sourceNode.x;
            let y = sourceNode.y;

            let otherPart = (part + 2) % 4;
            if (otherPart === 0) otherPart = 4;

            if (part === 1) y -= 200;
            else if (part === 2) x += 200;
            else if (part === 3) y += 200;
            else if (part === 4) x -= 200;

            this.nodes[++this.counter] = new Node(x, y, this.counter);

            this.connectLine(node, part, this.counter, otherPart);
        } else {
            this.nodes[++this.counter] = new Node(svg.width() / 2, svg.height() / 2, this.counter);
        }
    }

    connectLine(a, b, c, d) {
        this.nodes[a].relation[b] = c;
        this.nodes[c].relation[d] = b;

        this.lines[a + "a" + b + "d" + c + "a" + d] = new Line(a + "a" + b + "d" + c + "a" + d, this.nodes[a], this.nodes[c], b, d);
    }

    startDrag(e) {
        let elem = $(e.target);
        if (elem.hasClass('draggable')) {
            if (elem.is('circle')) {
                this.holdNode = elem.closest('.node').attr('data-id');
                this.offset = this.getMousePosition(e);
                this.offset.x -= parseFloat(this.nodes[this.holdNode].x);
                this.offset.y -= parseFloat(this.nodes[this.holdNode].y);
            } else if (elem.is('path')) {
                this.holdPath = this.getPathInfo(e);
            }
        }
    }

    drag(e) {
        if (this.holdNode) {
            e.preventDefault();
            $(this.nodes[this.holdNode].selector).addClass('ondrag');
            let coor = this.getMousePosition(e);
            this.nodes[this.holdNode].x = coor.x - this.offset.x;
            this.nodes[this.holdNode].y = coor.y - this.offset.y;
        }
    }

    endDrag(e) {
        if (this.holdNode) {
            $(this.nodes[this.holdNode].selector).removeClass('ondrag');
        }

        else if (this.holdPath) {
            this.holdMouse = true;
            let elem = $(e.target);
            if (elem.is('.draggable') && elem.is('path')) {
                let target = this.getPathInfo(e);
                if (this.nodes[target[0]].relation[target[1]] !== null) return;

                if (this.holdPath[0] === target[0]) {
                    this.holdMouse = false;
                    this.createNode(target[0], target[1]);
                } else {
                    this.connectLine(this.holdPath[0], this.holdPath[1], target[0], target[1]);
                }
            }
        }

        this.holdNode = null;
        this.holdPath = null;
    }

    getMousePosition(e) {
        let c = svg[0].getScreenCTM();
        return {
            x: (e.clientX - c.e) / c.a,
            y: (e.clientY - c.f) / c.d
        };
    }

    update() {
        for (let key in this.nodes) {
            this.nodes[key].update(this.selectedNode, this.holdPath);
        }

        for (let key in this.lines) {
            this.lines[key].update();
        }

        requestAnimationFrame(this.update.bind(this));
    }
}