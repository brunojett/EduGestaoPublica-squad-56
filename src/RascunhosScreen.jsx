import { View, Text, FlatList, StyleSheet } from 'react-native'
import { alunos, avaliacoes } from './dados.js'
import { Botao, Etiqueta, base } from '../../../src/componentes.jsx'

// Tela #202: lançamentos salvos como rascunho (para retomar depois)
export default function RascunhosScreen({ lancamentos, onRetomar }) {
  const rascunhos = avaliacoes.filter((av) => lancamentos[av]?.status === 'Rascunho')

  function renderRascunho({ item }) {
    const l = lancamentos[item]
    return (
      <View style={styles.card}>
        <View style={base.linhaTitulo}>
          <Text style={base.subtitulo}>{item}</Text>
          <Etiqueta status="Rascunho" />
        </View>
        <Text>Último salvamento: {l.salvoEm}</Text>
        <Text>{Object.keys(l.notas).length} de {alunos.length} notas digitadas</Text>
        <Text style={base.pequeno}>As notas em rascunho não entram na média da turma.</Text>
        <View style={base.rodape}>
          <Botao
            texto="Retomar"
            tipo="primario"
            rotulo={'Retomar rascunho de ' + item}
            onPress={() => onRetomar(item)}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={base.tela}>
      <Text style={base.titulo}>Rascunhos</Text>
      <Text>Lançamentos salvos como rascunho. Toque em Retomar para continuar de onde parou.</Text>

      <FlatList
        data={rascunhos}
        keyExtractor={(av) => av}
        renderItem={renderRascunho}
        ListEmptyComponent={<Text style={base.info}>Nenhum rascunho salvo</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
  },
})
