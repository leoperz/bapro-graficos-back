"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Barras {
    constructor() {
        this.valores = [70, 45, 90, 81, 56, 56, 40];
        this.labels = ['Roberto', 'Javier', 'Felipe', 'Matias', 'German', 'Ignacio', 'Alfredo'];
    }
    getBarChart() {
        return [
            { data: this.valores, label: "Encuenta" }
        ];
    }
    cambiarData(valor, label) {
        console.log("variables", valor, label);
        for (let i in this.labels) {
            if (this.labels[i] === label) {
                this.valores[i] += valor;
                return;
            }
        }
        console.log("no lo encontro");
    }
}
exports.Barras = Barras;
