"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LineChart {
    constructor() {
        this.meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
            'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        this.valores = [1, 2, 3, 4, 5];
    }
    getData() {
        return [
            { data: this.valores, label: 'Incidentes' }
        ];
    }
    cambiarValor(mes, valor) {
        mes = mes.toLowerCase().trim();
        for (let i in this.meses) {
            if (this.meses[i] === mes) {
                this.valores[i] += valor;
            }
        }
        return this.getData();
    }
}
exports.LineChart = LineChart;
