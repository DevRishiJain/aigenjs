import path from "path";

// let model_name = config.name;
// let model_layers = config.layers;

// model_layers.forEach((model_layer)=>{
//     console.log("Layer:", model_layer);
// });

export function changeExtension(file, extension) {
    const basename = path.basename(file, path.extname(file));
    return path.join(path.dirname(file), basename + extension);
}
