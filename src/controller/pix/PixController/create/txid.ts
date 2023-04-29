import * as crypto from 'crypto';

function geraStringAleatoria(): string {
  const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tamanhoMinimo = 26;
  const tamanhoMaximo = 35;
  const tamanhoAleatorio = Math.floor(Math.random() * (tamanhoMaximo - tamanhoMinimo + 1)) + tamanhoMinimo;
  const stringAleatoria = crypto.randomBytes(tamanhoAleatorio).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substr(0, tamanhoAleatorio);
  return stringAleatoria;
}

function validaString(string: string): boolean {
  const padrao = /^[a-zA-Z0-9]{26,35}$/;
  return padrao.test(string);
}

export default function Txid() {
  const stringAleatoria = geraStringAleatoria();
  const stringEhValida = validaString(stringAleatoria);
  if (stringEhValida) {

    return stringAleatoria
  } else {
    console.log('A string gerada não atende ao padrão.');
  }
}
