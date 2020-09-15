#!/usr/bin/env node

import { exit } from "process";
import { TIMEOUT } from "dns";

class plot {
    status: number;
    position: number;
    x: number;
    y: number;
    possible: number[];
    box: number;

    constructor(status: number, position: number) {
        this.status = status;
        this.position = position;
        this.x = 0;
        this.y = 0;
        let x_iter = 1;
        for (let i = 0; i < this.position; i += 9) {
            if (this.position - i <= 9) {
                this.x = this.position - i;
                this.y = x_iter;
            }
            x_iter++;
        }
        this.possible = [];

        this.box = 0;
        if (this.x < 4) {
            if (this.y < 4) {
                this.box = 1;
            } else if (this.y > 3 && this.y < 7) {
                this.box = 4;
            } else if (this.y > 6) {
                this.box = 7;
            }
        }

        if (this.x > 3 && this.x < 7) {
            if (this.y < 4) {
                this.box = 2;
            } else if (this.y > 3 && this.y < 7) {
                this.box = 5;
            } else if (this.y > 6) {
                this.box = 8;
            }
        }

        if (this.x > 6) {
            if (this.y < 4) {
                this.box = 3;
            } else if (this.y > 3 && this.y < 7) {
                this.box = 6;
            } else if (this.y > 6) {
                this.box = 9;
            }
        }
    }

    print() {
        console.log(this.x + "|" + this.y + ": " + this.status);
    }

    check(field: plot[]) {
        if (this.status !== 0) {
            this.possible = [];
            return;
        }
        this.possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        field.forEach((element) => {
            if (element.position === this.position) {
                return;
            }

            if (
                element.x === this.x ||
                element.box === this.box ||
                element.y === this.y
            ) {
                this.possible = this.possible.filter(function (el, ind) {
                    return el !== element.status;
                });
            }

            if (this.possible.length == 1) {
                if (this.status !== this.possible[0]) {
                    this.status = this.possible[0];
                    console.log("PLOT: " + this.position + " - ONLY NUMBER " + this.status + " POSSIBLE");
                }
                return;
            } else if (this.possible.length == 0) {
                console.log("Error, programm failed.");
                process.exit(0);
            }
            return;
        });
    }
}

class box {
    fields: plot[]; //Fileds in box
    position: number; //Position From left to right, then one line down
    sudoku: plot[]; //All fields (for check of the parts)


    constructor(fields: plot[], position: number, sudoku: plot[]) {
        this.fields = fields;
        this.position = position;
        this.sudoku = sudoku;
    }

    check() {
        for (let i = 1; i <= 9; i++) {
            let number_possible = 0;
            let position = 0;
            let iter = 0;
            this.fields.forEach(function (element) {
                if (element.possible.indexOf(i) !== -1) {
                    number_possible++;
                    position = iter;
                }
                iter++;
            })
            if (number_possible == 1) {
                this.fields[position].status = i;
                this.fields[position].possible = [];
                console.log("BOX: " + this.position + " - ONLY FIELD " + position + " POSSIBLE FOR NUMBER " + i)
            }
        }
    }
}

class field {
    plots: plot[];
    remaining: number;
    boxes: box[];



    constructor(list: number[]) {
        this.plots = [];
        this.boxes = [];
        let iter = 1;
        let boxes = [
            [1, 2, 3, 10, 11, 12, 19, 20, 21],
            [4, 5, 6, 13, 14, 15, 22, 23, 24],
            [7, 8, 9, 16, 17, 18, 25, 26, 27],
            [28, 29, 30, 37, 38, 39, 46, 47, 48],
            [31, 32, 33, 40, 41, 42, 49, 50, 51],
            [34, 35, 36, 43, 44, 45, 52, 53, 54],
            [55, 56, 57, 64, 65, 66, 73, 74, 75],
            [58, 59, 60, 67, 68, 69, 76, 77, 78],
            [61, 62, 63, 70, 71, 72, 79, 80, 81]
        ];
        this.remaining = 81;
        list.forEach((num) => {
            this.plots.push(new plot(num, iter));
            iter++;
            if (this.plots[this.plots.length - 1].status !== 0) {
                this.remaining--;
            }
        });
        for (let i = 0; i <= 8; i++) {
            let box_fields: plot[] = [];
            boxes[i].forEach(element => {
                box_fields.push(this.plots[element - 1]);
            });
            this.boxes.push(new box(box_fields, i, this.plots))
        }
        console.log("DONE: " + (81 - this.remaining));
    }

    check_plots() {
        this.remaining = 81;
        this.plots.forEach((element) => {
            element.check(this.plots);

            if (element.status !== 0) {
                this.remaining--;
            }
        });

        if (this.remaining === 0) {
            this.print();
            console.log("Done");
            process.exit(0);
        }
    }


    check_boxes () {
        this.boxes.forEach(element => {
            element.check();
        });
        this.check_plots();
    }


    print() {
        let get = function (n: number, plots: plot[]) {
            return plots[n].status;
        };
        console.log(
            "DONE: " +
                (81 - this.remaining) +
                "\n" +
                get(0, this.plots) +
                get(1, this.plots) +
                get(2, this.plots) +
                "|" +
                get(3, this.plots) +
                get(4, this.plots) +
                get(5, this.plots) +
                "|" +
                get(6, this.plots) +
                get(7, this.plots) +
                get(8, this.plots)
        +
            "\n" +
                get(9, this.plots) +
                get(10, this.plots) +
                get(11, this.plots) +
                "|" +
                get(12, this.plots) +
                get(13, this.plots) +
                get(14, this.plots) +
                "|" +
                get(15, this.plots) +
                get(16, this.plots) +
                get(17, this.plots)
            +
            "\n" +
                get(18, this.plots) +
                get(19, this.plots) +
                get(20, this.plots) +
                "|" +
                get(21, this.plots) +
                get(22, this.plots) +
                get(23, this.plots) +
                "|" +
                get(24, this.plots) +
                get(25, this.plots) +
                get(26, this.plots)
        +
            "\n" +
                get(27, this.plots) +
                get(28, this.plots) +
                get(29, this.plots) +
                "|" +
                get(30, this.plots) +
                get(31, this.plots) +
                get(32, this.plots) +
                "|" +
                get(33, this.plots) +
                get(34, this.plots) +
                get(35, this.plots)
        +
            "\n" +
                get(36, this.plots) +
                get(37, this.plots) +
                get(38, this.plots) +
                "|" +
                get(39, this.plots) +
                get(40, this.plots) +
                get(41, this.plots) +
                "|" +
                get(42, this.plots) +
                get(43, this.plots) +
                get(44, this.plots)
        +
            "\n" +
                get(45, this.plots) +
                get(46, this.plots) +
                get(47, this.plots) +
                "|" +
                get(48, this.plots) +
                get(49, this.plots) +
                get(50, this.plots) +
                "|" +
                get(51, this.plots) +
                get(52, this.plots) +
                get(53, this.plots)
        +
            "\n" +
                get(54, this.plots) +
                get(55, this.plots) +
                get(56, this.plots) +
                "|" +
                get(57, this.plots) +
                get(58, this.plots) +
                get(59, this.plots) +
                "|" +
                get(60, this.plots) +
                get(61, this.plots) +
                get(62, this.plots)
        +
            "\n" +
                get(63, this.plots) +
                get(64, this.plots) +
                get(65, this.plots) +
                "|" +
                get(66, this.plots) +
                get(67, this.plots) +
                get(68, this.plots) +
                "|" +
                get(69, this.plots) +
                get(70, this.plots) +
                get(71, this.plots)
        +
            "\n" +
                get(72, this.plots) +
                get(73, this.plots) +
                get(74, this.plots) +
                "|" +
                get(75, this.plots) +
                get(76, this.plots) +
                get(77, this.plots) +
                "|" +
                get(78, this.plots) +
                get(79, this.plots) +
                get(80, this.plots)
        );
        console.log("GLOBAL ITER: " + global_iter);
    }
}

const sudoku = new field([
    2, //1
    0,
    0,
    0,
    1,
    0,
    0,
    9,
    0,
    0, //2
    0,
    0,
    0,
    0,
    0,
    1,
    4,
    0,
    5, //3
    4,
    0,
    0,
    0,
    8,
    0,
    0,
    0,
    0, //4
    5,
    0,
    0,
    2,
    0,
    0,
    0,
    0,
    0, //5
    1,
    4,
    3,
    0,
    9,
    7,
    5,
    0,
    0, //6
    0,
    0,
    0,
    7,
    0,
    0,
    6,
    0,
    0, //7
    0,
    0,
    7,
    0,
    0,
    0,
    2,
    9,
    0, //8
    3,
    9,
    0,
    0,
    0,
    0,
    0,
    0,
    0, //9
    6,
    0,
    0,
    5,
    0,
    0,
    0,
    1,
]);

/*

0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0

*/

let run = true;
var global_iter = 0;

while (run) {
    sudoku.check_plots();
    sudoku.check_boxes();
    global_iter++;

    if (global_iter > 300) {
        sudoku.print();
        process.exit(0);
    }
}
