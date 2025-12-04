import { Jugadores } from './Jugadores.js';
import { Enemigos, JefeFinal } from './enemigos.js';

/**
 * Simula una batalla entre un jugador y un enemigo.
 * Tiene en cuenta ataque/defensa, consumibles y jefes con multiplicador.
 * @param {Jugadores} player - Instancia del jugador
 * @param {Enemigos} enemy - Instancia del enemigo
 * @returns {{ganador:string, detalle:string}} Resultado con ganador y detalle de la pelea
 */
function batalla(player, enemy) {
	// INSTANCEOF: comprueba si una variable es instancia de una clase específica
	// Valida que los argumentos sean del tipo correcto
	if (!player || !enemy) {
 		return { ganador: 'error', detalle: 'Faltan argumentos player o enemy' };
 	}

	// Comprobación de tipos: verifica que sean instancias de las clases correctas
	if (!(player instanceof Jugadores) || !(enemy instanceof Enemigos)) {
 		return { ganador: 'error', detalle: 'Los argumentos deben ser instancias de Jugadores y Enemigos' };
 	}

	const ataqueJugador = player.ataqueTotal();
	const defensaJugador = player.defensaTotal();

	const ataqueEnemigo = enemy.nivelataque || 0;
	const defensaEnemigo = 0; // Los enemigos no tienen defensa en su clase

	const dañoJugador = Math.max(0, ataqueJugador - defensaEnemigo);
	let dañoEnemigo = Math.max(0, ataqueEnemigo - defensaJugador);

	// INSTANCEOF para casos especiales: si es un jefe final, multiplica el daño
	if (enemy instanceof JefeFinal) {
		dañoEnemigo *= enemy.multiplicardanio;
	}

	const vidaEnemigoAntes = enemy.puntosvida || 0;
	const vidaJugadorAntes = (player.vida !== undefined) ? player.vida : (player.vidaMaxima || 100);

	let ganador;
	let detalle = `Jugador(A:${ataqueJugador},D:${defensaJugador}) vs Enemigo(A:${ataqueEnemigo},D:${defensaEnemigo}) => DañoJugador=${dañoJugador}, DañoEnemigo=${dañoEnemigo}`;

	// Contar consumibles disponibles (sin mutar inventario)
	var potionsCount = 0;
	var revivirCount = 0;
	if (player && Array.isArray(player.inventario)) {
		for (var i = 0; i < player.inventario.length; i++) {
			var it = player.inventario[i];
			if (!it || !it.nombre) continue;
			var nombre = String(it.nombre).toLowerCase();
			if (nombre.indexOf('revivir') !== -1) revivirCount += 1;
			else if (nombre.indexOf('pocion') !== -1) potionsCount += 1;
		}
	}

	// Calcula cuánta vida total puede recuperar el jugador
	const totalHealAvailable = revivirCount * 100 + potionsCount * 50;

	// Turnos necesarios para matar al enemigo (si dañoJugador==0 => Infinity)
	// OPERADOR TERNARIO: calcula cuántos turnos se necesitan, o Infinity si no puede dañar
	const turnsToKillEnemy = (dañoJugador > 0) ? Math.ceil(vidaEnemigoAntes / dañoJugador) : Infinity;
	// Vida efectiva del jugador incluyendo curables
	const effectivePlayerLife = vidaJugadorAntes + totalHealAvailable;
	// Turnos que tarda el enemigo en matar al jugador (incluso con curativos)
	const turnsToDieWithAllHeals = (dañoEnemigo > 0) ? Math.ceil(effectivePlayerLife / dañoEnemigo) : Infinity;

	// Si el jugador no puede infligir daño nunca, no podrá ganar
	if (dañoJugador === 0) {
		detalle += ` -- Resultado: GANA ENEMIGO (el jugador no puede infligir daño)`;
		player.vida = Math.max(0, vidaJugadorAntes - dañoEnemigo);
		return { ganador: 'enemy', detalle };
	}

	// Si con todos los curativos disponibles puede matar al enemigo antes de morir
	if (turnsToKillEnemy <= turnsToDieWithAllHeals) {
		// Simular combate real, consumiendo items sólo cuando se usen
		var enemyLife = vidaEnemigoAntes;
		var playerLife = vidaJugadorAntes;

		while (enemyLife > 0 && playerLife > 0) {
			// Turno del jugador
			enemyLife = enemyLife - dañoJugador;
			if (enemyLife <= 0) break;
			// Turno del enemigo
			playerLife = playerLife - dañoEnemigo;
			if (playerLife > 0) continue;

			// Si el jugador muere, intenta usar curativos
			var consumed = false;
			var idxRevivir = -1;
			for (var i = 0; i < player.inventario.length; i++) {
				var it = player.inventario[i];
				if (it && it.nombre && String(it.nombre).toLowerCase().indexOf('revivir') !== -1) { idxRevivir = i; break; }
			}
			if (idxRevivir !== -1) {
				player.inventario.splice(idxRevivir, 1);
				playerLife = 100;
				consumed = true;
			} else {
				var idxPoc = -1;
				for (var j = 0; j < player.inventario.length; j++) {
					var it2 = player.inventario[j];
					if (it2 && it2.nombre && String(it2.nombre).toLowerCase().indexOf('pocion') !== -1) { idxPoc = j; break; }
				}
				if (idxPoc !== -1) {
					player.inventario.splice(idxPoc, 1);
					playerLife = playerLife + 50;
					consumed = true;
				}
			}
			if (!consumed) break;
		}

		if (enemyLife <= 0 && playerLife > 0) {
			ganador = 'player';
			var puntosGanados = 30;
			if (enemy && enemy.nombre) {
				var ename = String(enemy.nombre).toLowerCase();
				if (ename.indexOf('orco') !== -1) puntosGanados = 60;
				else if (ename.indexOf('demonio') !== -1) puntosGanados = 100;
				else if (ename.indexOf('drag') !== -1 || ename.indexOf('dragon') !== -1 || ename.indexOf('dragón') !== -1) puntosGanados = 200;
			}
			if (typeof player.sumarPuntos === 'function') player.sumarPuntos(puntosGanados);
			else player.puntos = (player.puntos || 0) + puntosGanados;
			player.victorias = (player.victorias || 0) + 1;
			player.vida = Math.max(0, playerLife);
			if (typeof enemy.puntosvida !== 'undefined') enemy.puntosvida = Math.max(0, enemyLife);
			detalle += ` -- Resultado: GANA JUGADOR (+${puntosGanados} pts)`;
			return { ganador, detalle };
		}

		// Si llegó aquí, no pudo vencer aunque consumiendo
		player.vida = Math.max(0, playerLife);
		if (typeof enemy.puntosvida !== 'undefined') enemy.puntosvida = Math.max(0, enemyLife);
		ganador = (player.vida > 0) ? 'draw' : 'enemy';
		detalle += player.vida > 0 ? ' -- Resultado: EMPATE (no ganó este turno)' : ' -- Resultado: GANA ENEMIGO (muere tras consumir consumibles)';
		return { ganador, detalle };
	}

	// Si con todos los curativos aun así muere antes de poder matar -> pierde
	detalle += ` -- Resultado: GANA ENEMIGO (no puede matar al enemigo antes de morir, incluso consumiendo ítems)`;
	player.vida = Math.max(0, vidaJugadorAntes - dañoEnemigo);
	return { ganador: 'enemy', detalle };
}

/**
 * Clasifica jugadores en 'pro' o 'rookie' según puntos o ranking previo.
 * @param {Array} players - Array de objetos jugador
 * @param {Array} currentRanking - Ranking previo opcional
 * @returns {Array<{nombre:string,puntos:number,categoria:string}>}
 */
function categorizePlayers(players = [], currentRanking = []) {
	var umbralPro = 100;
	var resultado = [];
	var hayRankingPrevio = Array.isArray(currentRanking) && currentRanking.length > 0;
	for (var i = 0; i < players.length; i++) {
		var p = players[i];
		var puntos = (p && p.puntos) ? p.puntos : 0;
		var categoria = 'rookie';
		if (!hayRankingPrevio && i === 0) {
			categoria = 'pro';
		} else if (puntos >= umbralPro) {
			categoria = 'pro';
		}
		resultado.push({ nombre: (p && p.nombre) ? p.nombre : ('Jugador' + (i + 1)), puntos: puntos, categoria: categoria });
	}
	return resultado;
}

/**
 * Muestra en consola el ranking ordenado por puntos y devuelve una tabla resumen.
 * @param {Array<Object>} players - Array de jugadores con propiedades como `nombre`, `puntos`, `victorias`, etc.
 * @returns {Array<Object>} Tabla con las columnas: Pos, Nombre, Puntos, Victorias, Ataque, Defensa
 */
function mostrarRanking(players = []) {
	if (!Array.isArray(players)) {
		console.error('mostrarRanking: se esperaba un array de jugadores');
		return [];
	}
	// Crear copia y ordenar
	var copia = players.slice();
	copia.sort(function(a, b) { return ((b.puntos || 0) - (a.puntos || 0)); });

	var tabla = [];
	for (var i = 0; i < copia.length; i++) {
		var p = copia[i];
		tabla.push({
			Pos: i + 1,
			Nombre: (p && p.nombre) ? p.nombre : ('Jugador' + (i + 1)),
			Puntos: (p && p.puntos) ? p.puntos : 0,
			Victorias: (p && p.victorias) ? p.victorias : 0,
			Ataque: (p && typeof p.ataqueTotal === 'function') ? p.ataqueTotal() : ((p && p.nivelataque) ? p.nivelataque : 0),
			Defensa: (p && typeof p.defensaTotal === 'function') ? p.defensaTotal() : ((p && p.defensa) ? p.defensa : 0)
		});
	}
	console.table(tabla);
	return tabla;
}

/**
 * Muestra por consola un reporte completo de rondas, combates y el ranking final.
 * @param {Array<Object>} rounds - Array con información de rondas. Cada ronda debe tener un campo `combates` que es un array de objetos {playerName, enemyName, ganador, puntosGanados}.
 * @param {Array<Object>} players - Array de jugadores para clasificar y mostrar en el ranking final.
 * @returns {{rondas:number, ranking:Array<Object>}} Resumen con número de rondas y ranking final ordenado por puntos.
 */
function mostrarReporteCompleto(rounds = [], players = []) {
	// 1) Mostrar combates por ronda
	for (var r = 0; r < rounds.length; r++) {
		var ronda = rounds[r];
		console.log('\n\u2694\ufe0f RONDA ' + (r + 1));
		if (!ronda || !Array.isArray(ronda.combates)) {
			console.log('  (sin combates registrados)');
			continue;
		}
		for (var cI = 0; cI < ronda.combates.length; cI++) {
			var c = ronda.combates[cI];
			var pName = c.playerName || 'Jugador';
			var eName = c.enemyName || 'Enemigo';
			var g = c.ganador || 'desconocido';
			var pts = (typeof c.puntosGanados === 'number') ? (' | +' + c.puntosGanados + ' pts') : '';
			console.log('  - ' + pName + ' vs ' + eName + ' -> ganador: ' + g + pts);
		}
	}

	// 2) Clasificación por nivel
	var categorias = categorizePlayers(players);
	var pros = [];
	var rookies = [];
	for (var i = 0; i < categorias.length; i++) {
		if (categorias[i].categoria === 'pro') pros.push(categorias[i].nombre);
		else rookies.push(categorias[i].nombre);
	}

	console.log('\n\u{1F3C6} Clasificación por nivel:');
	console.log(' - PRO: ' + (pros.join(', ') || '---'));
	console.log(' - ROOKIE: ' + (rookies.join(', ') || '---'));

	// 3) Ranking final detallado
	console.log('\n\u{1F3C6} RANKING FINAL \u{1F3C6}');
	var ordenados = players.slice();
	ordenados.sort(function(a, b) { return ((b.puntos || 0) - (a.puntos || 0)); });

	for (var j = 0; j < ordenados.length; j++) {
		var jugador = ordenados[j];
		var nombre = (jugador && jugador.nombre) ? jugador.nombre : 'Jugador';
		var vidaStr = (jugador && typeof jugador.vida !== 'undefined') ? (jugador.vida + '/' + (jugador.vidaMaxima || 100)) : 'N/A';
		var puntos = (jugador && jugador.puntos) ? jugador.puntos : 0;
		var ataque = (jugador && typeof jugador.ataqueTotal === 'function') ? jugador.ataqueTotal() : ((jugador && jugador.nivelataque) ? jugador.nivelataque : 0);
		var defensa = (jugador && typeof jugador.defensaTotal === 'function') ? jugador.defensaTotal() : ((jugador && jugador.defensa) ? jugador.defensa : 0);
		var inventario = 'Sin inventario';
		if (jugador && Array.isArray(jugador.inventario)) {
			var parts = [];
			for (var k = 0; k < jugador.inventario.length; k++) {
				var it = jugador.inventario[k];
				parts.push((it && it.nombre) ? it.nombre : (it && it.tipo) ? it.tipo : JSON.stringify(it));
			}
			inventario = parts.join(', ');
		}

		console.log('\n------------------------------------');
		console.log(' ' + nombre);
		console.log(' Vida: ' + vidaStr);
		console.log(' Puntos: ' + puntos);
		console.log(' Ataque total: ' + ataque);
		console.log(' Defensa total: ' + defensa);
		console.log(' Inventario: ' + inventario);
	}

	return { rondas: rounds.length, ranking: ordenados };
}

// Funciones disponibles globalmente
export { batalla, categorizePlayers, mostrarRanking, mostrarReporteCompleto };