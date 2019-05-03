export class Barras{
    
    public valores: number[]=[65, 59, 80, 81, 56, 55, 40];
    public labels: string[]=['Roberto', 'Javier', 'Felipe', 'Matias', 'German', 'Ignacio', 'Alfredo'];


    constructor(){

    }

   getBarChart(){
       return [
        {data:this.valores, label:"Encuenta"}
       ];
   }

   cambiarData(valor:number, label:string){
    console.log("variables",valor,label );   
    for(let i in this.labels){
            if(this.labels[i] ===label){
                this.valores[i]+=valor;
                return ;
            }
           
            
        }
        console.log("no lo encontro")

   }

}