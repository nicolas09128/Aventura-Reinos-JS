
export class Enemigos {
    constructor(tipo, nombre, nivelataque, puntosvida) {
        this.tipo = 'Enemigo';
        this.nombre = nombre;
        this.nivelataque = nivelataque;
        this.puntosvida = puntosvida;
    }

    presentarse() {
        return 'Soy ' + this.nombre + ', el enemigo tengo ' + this.nivelataque + ' de ataque y ' + this.puntosvida + ' de vida ';
    }
}

export class JefeFinal extends Enemigos {
    constructor(nombre, nivelataque, puntosvida, habilidadespecial, multiplicardanio) {
        super('jefe', nombre, nivelataque, puntosvida);
        this.tipo = 'Jefe';
        this.habilidadespecial = habilidadespecial;
        this.multiplicardanio = (typeof multiplicardanio === 'number') ? multiplicardanio : 2.0;
    }

    presentarse() {
        return 'Soy ' + this.nombre + ', el jefe final. Mi habilidad especial es: ' + this.habilidadespecial;
    }
}