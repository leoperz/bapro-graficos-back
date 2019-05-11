"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Grafica {
    constructor() {
        this.meses = ['enero', 'febrero', 'marzo', 'abril'];
        this.valores = [1, 2, 3, 8];
    }
    getDataGrafica() {
        return [
            { data: this.valores, label: 'Ventas' }
        ];
    }
    cambiarValor(mes, valor) {
        mes = mes.toLowerCase().trim();
        //ciclo for
        for (let i in this.meses) {
            if (this.meses[i] == mes) {
                this.valores[i] += valor;
            }
        }
        return this.getDataGrafica();
    }
}
exports.Grafica = Grafica;
