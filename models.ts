import * as jsonfile from "jsonfile";

// no modificar estas propiedades, agregar todas las que quieras
class Peli {
  id: number;
  title: string;
  tags: string[];
}

class PelisCollection {

  getAll(): Promise<Peli[]> {
    return jsonfile.readFile("./pelis.json").then(async (peliculas) => {
      // la respuesta de la promesa
      return await peliculas;
    });
  }
  async getById(id: number): Promise<Peli> {
    return await this.getAll().then((peliculas) => {
      const res = peliculas.find(p => {return p.id === id})
      return res
    })
  }
  async search(options: any): Promise<Peli[]> {

    if (options.title && options.tag) {
      return await this.getAll().then((peliculas) => {
        const res = peliculas.filter(p => {
          return p.title.includes(options.title) && p.tags.includes(options.tag)
        })
        return res
      })
    } else if (options.title) {
      return await this.getAll().then((peliculas) => {
        const res = peliculas.filter(p => {
          return p.title.includes(options.title)
        })
        return res
      })
    } else if (options.tag) {
      return await this.getAll().then((peliculas) => {
        const res = peliculas.filter(p => {
        return p.tags.includes(options.tag)
      })
        return res
      })
    } else {
      throw "OPCIÓN NO VÁLIDA. OPCIONES VÁLIDAS: TITLE | TAG"
    }
  }
  add(peli: Peli): Promise<boolean> {
    const promesaUno = this.getById(peli.id).then(async (idExiste) => {
      if (idExiste) {
        return false
      } else {
        await this.getAll().then((peliculas) => {
          peliculas.push(peli)
          const promesaDos = jsonfile.writeFile("./pelis.json", peliculas)

          return promesaDos.then(()=>{ return true})
        })
        return true
      }
    });
    return promesaUno
  }
}
export { PelisCollection, Peli };
