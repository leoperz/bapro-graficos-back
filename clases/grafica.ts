export class Grafica{

    private meses: string[] = ['enero', 'febrero', 'marzo', 'abril'];
    private valores: number[] = [1,2,3,8];

    constructor(){

    }

    getDataGrafica(){
        return [
            {data:this.valores, label:'Ventas'}
        ];
    }

    cambiarValor(mes:string, valor:number){
        
        mes = mes.toLowerCase().trim();
        //ciclo for

        for(let i in this.meses){
            if(this.meses[i]==mes){
                this.valores[i] += valor;
            }
        }
        return this.getDataGrafica();
    }



}