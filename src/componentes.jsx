import { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { avaliacoes } from './dados.js'

export function Botao({ texto, onPress, tipo, desabilitado, rotulo }) {
  return (
    <TouchableOpacity
      style={[styles.botao, tipo === 'primario' && styles.botaoPrimario, desabilitado && styles.desabilitado]}
      onPress={onPress}
      disabled={desabilitado}
      aria-label={rotulo || texto}
    >
      <Text style={tipo === 'primario' ? styles.textoPrimario : styles.textoBotao}>{texto}</Text>
    </TouchableOpacity>
  )
}

// O texto do status sempre aparece junto da cor
export function Etiqueta({ status }) {
  if (!status) return null
  return (
    <View style={[styles.etiqueta, status === 'Enviado' ? styles.enviado : styles.rascunho]}>
      <Text style={styles.textoEtiqueta}>{status}</Text>
    </View>
  )
}

export function Aviso({ texto, onFechar }) {
  useEffect(() => {
    if (!texto) return
    const t = setTimeout(onFechar, 4000) // some sozinho após alguns segundos
    return () => clearTimeout(t)
  }, [texto])

  if (!texto) return null
  return (
    <View style={styles.aviso}>
      <Text style={styles.textoAviso}>{texto}</Text>
      <TouchableOpacity onPress={onFechar} aria-label="Fechar aviso">
        <Text style={styles.textoAviso}>×</Text>
      </TouchableOpacity>
    </View>
  )
}

// Não tem toque no fundo: só fecha pelos dois botões
export function Modal({ titulo, children, textoConfirmar, textoCancelar, onConfirmar, onCancelar }) {
  return (
    <View style={styles.fundo}>
      <View style={styles.caixa}>
        <Text style={styles.tituloModal}>{titulo}</Text>
        {children}
        <View style={base.rodape}>
          <Botao texto={textoConfirmar} tipo="primario" onPress={onConfirmar} />
          <Botao texto={textoCancelar} onPress={onCancelar} />
        </View>
      </View>
    </View>
  )
}

// Escolha da avaliação em botões (mostra o status de cada uma)
export function SeletorAvaliacao({ valor, onEscolher, lancamentos, comTodas }) {
  return (
    <View style={base.rodape}>
      {comTodas && (
        <Botao texto="Todas as avaliações" tipo={valor === '' ? 'primario' : undefined} onPress={() => onEscolher('')} />
      )}
      {avaliacoes.map((nome) => (
        <Botao
          key={nome}
          texto={nome + (lancamentos[nome] ? ' (' + lancamentos[nome].status + ')' : '')}
          tipo={valor === nome ? 'primario' : undefined}
          onPress={() => onEscolher(nome)}
        />
      ))}
    </View>
  )
}

// Estilos usados por várias telas
export const base = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f5f7f8', paddingHorizontal: 16, paddingTop: 8 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#0f6b7a', marginBottom: 4 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  info: { marginVertical: 8, color: '#4b5563' },
  pequeno: { fontSize: 12, color: '#4b5563' },
  banner: {
    backgroundColor: '#e6f1f3',
    padding: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0f6b7a',
  },
  linhaTitulo: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  rodape: { flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 8 },
  input: {
    width: 80,
    padding: 6,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  inputErro: { borderWidth: 2, borderColor: '#b91c1c', backgroundColor: '#fef2f2' },
  inputBloqueado: { backgroundColor: '#e5e7eb' },
  msgErro: { fontSize: 12, color: '#b91c1c' },
})

const styles = StyleSheet.create({
  botao: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#0f6b7a',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  botaoPrimario: { backgroundColor: '#0f6b7a' },
  desabilitado: { opacity: 0.5 },
  textoBotao: { color: '#0f6b7a' },
  textoPrimario: { color: 'white' },
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  enviado: { backgroundColor: '#d1fae5' },
  rascunho: { backgroundColor: '#fef3c7' },
  textoEtiqueta: { fontSize: 12, color: '#1f2937' },
  aviso: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#065f46',
  },
  textoAviso: { color: 'white' },
  fundo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  caixa: { width: '100%', maxWidth: 400, padding: 24, borderRadius: 8, backgroundColor: 'white' },
  tituloModal: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
})
