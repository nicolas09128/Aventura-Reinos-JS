import { Producto } from './producto.js';
export class Mercado {
    
    /**
     * Crea un nuevo mercado con una lista de productos.
     */
    listaProductos = [
        new Producto("Espada Basica", 30, "Común", "arma", { ataque: 5 }),
        new Producto("Espada Normal", 60, "Raro", "arma", { ataque: 10 }),
        new Producto("Armadura Ligera", 100, "Raro", "armadura", { defensa: 10 }),
        new Producto("Pocion de vida", 30, "Común", "consumible", { curacion: 50 }),
        new Producto("Revivir", 100, "Raro", "consumible", { curacion: 100 }),
        new Producto("Hacha", 200, "Épico", "arma", { ataque: 15 }),
        new Producto("Escudo Antiguo", 200, "Épico", "armadura", { defensa: 20 }),
        new Producto("Escudo Legendario", 400, "Legendario", "armadura", { defensa: 40 })
    ];

    // Guardar precios originales para poder resetear descuentos
    preciosOriginales = [];

    constructor() {
        // Almacenar precios originales de cada producto
        for (var i = 0; i < this.listaProductos.length; i++) {
            this.preciosOriginales[i] = this.listaProductos[i].precio;
        }
    }

    /**
     * Filtrar productos por rareza
     * @param rareza Rareza por la que filtrar 
     * @returns Lista de productos que coinciden con la rareza indicada
     */
    filtrarPorRareza(rareza) {
        var result = [];
        for (var i = 0; i < this.listaProductos.length; i++) {
            var producto = this.listaProductos[i];
            if (producto && producto.rareza === rareza) result.push(producto);
        }
        return result;
    }

    /**
     * 
     * @param rareza Rareza por la que filtrar
     * @param porcentaje Porcentaje de descuento a aplicar
     * @returns Lista de productos con el descuento aplicado
     */
    aplicarDescuento(rareza, porcentaje) {
        for (var i = 0; i < this.listaProductos.length; i++) {
            var producto = this.listaProductos[i];
            if (producto && producto.rareza === rareza) {
                producto.aplicarDescuento(porcentaje);
            }
        }
        return this.listaProductos;
    }

    /**
     * 
     * @param nombre Nombre del producto a buscar
     * @returns Producto que coincide con el nombre indicado o undefined si no se encuentra
     */
    buscarProducto(nombre) {
        for (var i = 0; i < this.listaProductos.length; i++) {
            var producto = this.listaProductos[i];
            if (producto && producto.nombre === nombre) return producto;
        }
        return undefined;
    }

    /**
     * 
     * @returns Descripción de todos los productos en el mercado
     */
    mostrarProducto() {
        var lines = [];
        for (var i = 0; i < this.listaProductos.length; i++) {
            var prod = this.listaProductos[i];
            if (prod && typeof prod.presentar === 'function') lines.push(prod.presentar());
        }
        return lines.join('\n');
    }

    /**
     * Reinicia los precios de todos los productos a sus valores originales.
     * Usado al reiniciar el juego para resetear descuentos aplicados.
     * @returns {void}
     */
    resetearPrecios() {
        for (var i = 0; i < this.listaProductos.length; i++) {
            if (i < this.preciosOriginales.length) {
                this.listaProductos[i].precio = this.preciosOriginales[i];
            }
        }
    }
}
