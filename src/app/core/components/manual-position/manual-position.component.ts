import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'manual-position',
    templateUrl: 'manual-position.component.html'
})

export class ManualPositionComponent implements OnInit {
    public espalderas: number[];
    public espaldera: number;
    public hileras: number[];
    public hilera: number;
    public posiciones: number[];
    public posicion: number;
    constructor() { }

    @Input('current-position') set cPosition(c: { espaldera: number, hilera: number, posicion: number }) {
        this.espaldera = c.espaldera;
        this.hilera = c.hilera;
        this.posicion = c.posicion;
    };

    @Output('new-position') newPosition: EventEmitter<{ espaldera: number; hilera: number; posicion: number; }> = new EventEmitter();
    @Output('search-position') searchPosition: EventEmitter<{ espaldera: number; hilera: number; posicion: number; }> = new EventEmitter();

    ngOnInit() {
        var espalderas = 18;
        var hileras = 30;
        var posiciones = 300;
        this.espalderas = Array.apply(null, { length: espalderas }).map(Number.call, Number);
        this.hileras = Array.apply(null, { length: hileras }).map(Number.call, Number);
        this.posiciones = Array.apply(null, { length: posiciones }).map(Number.call, Number);
    }
    search() {
        this.searchPosition.next({ espaldera: this.espaldera, hilera: this.hilera, posicion: this.posicion });
    }
    onPositionChange() {
        this.newPosition.next({ espaldera: this.espaldera, hilera: this.hilera, posicion: this.posicion });
    }


}