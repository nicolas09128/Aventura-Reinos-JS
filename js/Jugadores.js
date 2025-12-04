/**
 * Clase que representa al jugador.
 * Contiene nombre, puntos, vida, inventario y métodos para calcular stats.
 * Se diseñó para ser fácil de usar desde el script principal.
 */
export class Jugadores {
    nombre;
    puntos = 0;
    vida = 100;
    vidaMaxima = 100;
    inventario = [];
    dinero = 0;
    constructor(nombre) {
        this.nombre = nombre;
        this.puntos = 0;
        this.vida = this.vidaMaxima;
        this.vidaMaxima = 100;
        this.inventario = [];
        this.dinero = 0;
        
    }

    /**
     * Añade un objeto al inventario. Se guarda una copia para evitar referencias.
     * @param {Object} objeto - Objeto del mercado (nombre, tipo, bonus, etc.)
     */
    anadirObjeto(objeto) {
        // SPREAD OPERATOR: {...objeto} crea una COPIA del objeto (no la referencia original)
        // Esto evita que cambios posteriores al objeto afecten al inventario
        const objetoClone = {
            ...objeto
        };
        this.inventario.push(objetoClone);
    }

    /**
     * Suma puntos al jugador.
     * @param {number} puntos - Cantidad de puntos a sumar.
     */
    sumarPuntos(puntos) {
        this.puntos += puntos;
    }
    sumarDinero(dinero) {
        this.dinero += dinero;
    }

    /**
     * Calcula y devuelve el ataque total del jugador sumando todas las armas.
     * @returns {number} Valor total de ataque.
     */
    ataqueTotal() {
        var miAtaque = 0;
        for (var i = 0; i < this.inventario.length; i++) {
            var objeto = this.inventario[i];
            if (!objeto) continue;
            if (objeto.tipo === 'arma') {
                var base = objeto.ataque ? objeto.ataque : 0;
                var bonus = 0;
                if (objeto.bonus && typeof objeto.bonus === 'object' && objeto.bonus.ataque) {
                    bonus = objeto.bonus.ataque;
                }
                miAtaque = miAtaque + base + bonus;
            }
        }
        return miAtaque;
    }

    /**
     * Calcula y devuelve la defensa total del jugador sumando todas las armaduras.
     * @returns {number} Valor total de defensa.
     */
    defensaTotal() {
        var miDefensa = 0;
        for (var i = 0; i < this.inventario.length; i++) {
            var objeto = this.inventario[i];
            if (!objeto) continue;
            if (objeto.tipo === 'armadura') {
                var baseD = objeto.defensa ? objeto.defensa : 0;
                var bonusD = 0;
                if (objeto.bonus && typeof objeto.bonus === 'object' && objeto.bonus.defensa) {
                    bonusD = objeto.bonus.defensa;
                }
                miDefensa = miDefensa + baseD + bonusD;
            }
        }
        return miDefensa;
    }

    /**
     * Agrupa el inventario por tipo y devuelve un objeto con arrays por tipo.
     * Ejemplo: { arma: [...], armadura: [...], consumible: [...] }
     * @returns {Object<string, Array>} Grupos de inventario por tipo.
     */
    inventarioPorTipo() {
        // OBJETO VACÍO: {} sirve como contenedor para los grupos
        const grupos = {};
        
        // Recorro cada objeto del inventario
        for (let objeto of this.inventario) {
            // Si no existe todavía un grupo para este tipo, lo CREO como array vacío
            if (!grupos[objeto.tipo]) {
                grupos[objeto.tipo] = [];
            }
            // ACCESO DINÁMICO: grupos[objeto.tipo] accede a la propiedad con el nombre del tipo
            // Ejemplo: grupos['arma'].push(objeto) => agrupa todas las armas en un array
            grupos[objeto.tipo].push(objeto);
        }
        
        return grupos;
    }
    /**
     * Devuelve un objeto con la información principal del jugador para mostrar en UI.
     * @returns {Object} Datos del jugador (nombre, puntos, vida, ataque, defensa, inventario).
     */
    mostrar() {
        return {
            nombre: this.nombre,
            puntos: this.puntos,
            dinero: this.dinero,
            vida: this.vida, // Añadir vida actual
            vidaMaxima: this.vidaMaxima,
            ataque: this.ataqueTotal(),
            defensa: this.defensaTotal(),
            inventario: this.inventarioPorTipo()
        };
    }
}