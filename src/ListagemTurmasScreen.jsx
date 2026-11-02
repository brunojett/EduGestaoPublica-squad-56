import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListagemTurmasScreen() {
  // #359: lista fixa de 5 turmas, guardada com useState
  // Para testar o aviso de lista vazia (#362), troque a lista abaixo por []
  const [turmas] = useState([
    { id: '1', codigo: '8º A', disciplina: 'Matemática', dias: 'Seg e Qua', turno: 'Manhã', professor: 'Carlos Mendes', vagas: '28/35' },
    { id: '2', codigo: '8º B', disciplina: 'Português', dias: 'Ter e Qui', turno: 'Manhã', professor: 'Helena Souza', vagas: '30/35' },
    { id: '3', codigo: '9º A', disciplina: 'Ciências', dias: 'Seg e Sex', turno: 'Tarde', professor: 'Ricardo Alves', vagas: '32/35' },
    { id: '4', codigo: '9º B', disciplina: 'História', dias: 'Qua e Sex', turno: 'Tarde', professor: 'Marina Costa', vagas: '25/30' },
    { id: '5', codigo: '7º A', disciplina: 'Geografia', dias: 'Ter e Qui', turno: 'Tarde', professor: 'Paulo Ribeiro', vagas: '22/30' },
  ]);

  // #361: os botões só fazem console.log
  function adicionarTurma() {
    console.log('Botão + pressionado');
  }

  function editarTurma(turma) {
    console.log('Editar turma:', turma.codigo);
  }

  // #360: tocar no card só faz console.log
  function abrirTurma(turma) {
    console.log('Turma selecionada:', turma.codigo);
  }

  // #360: um cartão por turma, com todas as informações
  function renderTurma({ item }) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => abrirTurma(item)}>
        <View style={styles.cardTopo}>
          <Text style={styles.codigo}>{item.codigo}</Text>
          <TouchableOpacity
            style={styles.botaoEditar}
            aria-label={'Editar turma ' + item.codigo}
            onPress={() => editarTurma(item)}
          >
            <Text style={styles.textoEditar}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text>{item.disciplina}</Text>
        <Text>{item.dias}, {item.turno}</Text>
        <Text>Professor: {item.professor}</Text>
        <Text>Vagas ocupadas: {item.vagas}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.tela}>
      {/* #361: título "Turmas" e botão "+" no topo */}
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Turmas</Text>
        <TouchableOpacity style={styles.botaoMais} aria-label="Adicionar turma" onPress={adicionarTurma}>
          <Text style={styles.textoMais}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id}
        renderItem={renderTurma}
        contentContainerStyle={styles.lista}
        // #362: aviso quando não há turmas
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma turma cadastrada</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f5f7f8', paddingTop: 24 },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#0f6b7a' },
  botaoMais: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f6b7a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoMais: { color: 'white', fontSize: 24 },
  lista: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    marginBottom: 12,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codigo: { fontSize: 18, fontWeight: 'bold' },
  botaoEditar: {
    borderWidth: 1,
    borderColor: '#0f6b7a',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  textoEditar: { color: '#0f6b7a' },
  vazio: { textAlign: 'center', marginTop: 32, fontSize: 16, color: '#4b5563' },
});
