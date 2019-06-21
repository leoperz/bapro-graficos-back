export class LineChart{

    private meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                                 'agosto','septiembre','octubre','noviembre','diciembre'];
    
    private valores: number[] = [1,2,3,4,5];


    constructor(){

    }

    getData(){
        return [
            {data:this.valores, label:'Incidentes'}
        ];
    }

    cambiarValor(mes:string, valor:number){
        mes = mes.toLowerCase().trim();
        for(let i in this.meses){
            if(this.meses[i] === mes){
                this.valores[i]+= valor;
            }
        }
        return this.getData();
    }
}