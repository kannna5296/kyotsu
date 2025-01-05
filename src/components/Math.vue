<template>
  <div class="container">
    <h1>共通テスト 数学回答用紙くん</h1>
    <p class="description">
      共通テストの数学回答用紙です。<br>模擬試験ブン回したいけど印刷するのがめんどくさい時に使ってください。
    </p>
    <div class="problem-grid">
      <table>
        <thead>
          <tr>
            <th class="problem-column">
              問題番号
            </th>
            <th
              v-for="option in options"
              :key="option"
            >
              {{ option }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="problem in problems"
            :key="problem"
          >
            <td class="problem-column">
              {{ problem }}
            </td>
            <td
              v-for="option in options"
              :key="option"
              class="radio-cell"
            >
              <input
                :id="'problem-' + problem + '-' + option"
                v-model="answers[problem]"
                type="radio"
                :name="'problem-' + problem"
                :value="option"
                class="radio-input"
                :disabled="isAnsweringEnded"
                @click="handleRadioClick(problem, option)"
              >
              <label
                :for="'problem-' + problem + '-' + option"
                class="radio-label"
                :class="{ selected: answers[problem] === option }"
              >
                <span class="background-text">{{ option }}</span>
              </label>
            </td>
            <td
              v-if="isAnsweringEnded"
              class="radio-cell"
              :class="{ correct: isCorrect(problem) }"
              @click="markAsCorrect(problem)"
            >
              ⚪︎
            </td>
            <td
              v-if="isAnsweringEnded"
              class="radio-cell"
              :class="{ incorrect: isIncorrect(problem) }"
              @click="markAsIncorrect(problem)"
            >
              ×
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- サイドバー -->
  <div
    class="sidebar"
    :class="{ answering: !isAnsweringEnded, grading: isAnsweringEnded }"
  >
     <p v-if="isAnsweringEnded">採点中<br>(回答を変更できません)</p>
      <p v-else>回答中</p>

      <p>回答した数: {{ answeredCount }}</p>
      <div v-if="isAnsweringEnded">
        <!-- 正答数 -->
        <p>正答数: {{ correctCount }}</p>
        <!-- 正答率 -->
        <p>正答率: {{ correctRate.toFixed(2) }}%</p>
      </div>
    <div>
      <!-- ボタン -->
      <button
        v-if="!isAnsweringEnded"
        class="end-button"
        @click="endAnswering"
      >
        回答終了
      </button>
      <button
        v-if="isAnsweringEnded"
        class="next-button"
        @click="nextExam"
      >
        次の試験に移る
      </button>
    </div>
  </div>

  <p class="author">
    作成者: 
    <a href="https://x.com/hiro_cashless" target="_blank" rel="noopener noreferrer">
      <i class="fa-brands fa-x-twitter"></i> @hiro_cashless
    </a>
    <span> | </span>
    <a href="https://github.com/kannna5296" target="_blank" rel="noopener noreferrer">
      <i class="fab fa-github"></i> GitHub
    </a>
  </p>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 問題番号を定義（「ア」から「ホ」まで）
const problems: string[] = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
];

// ラジオボタンの選択肢を定義
const options: string[] = ['-', '±', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// 問題番号ごとの回答を管理（初期値は null）
const answers = ref<Record<string, string | null>>(
  problems.reduce((acc, problem) => {
    acc[problem] = null; // 初期状態は選択なし
    return acc;
  }, {} as Record<string, string | null>),
);

// 回答終了後に変更を無効化するフラグ
const isAnsweringEnded = ref(false);

// ラジオボタンをクリックした際の選択解除処理
function handleRadioClick(problem: string, option: string) {
  if (answers.value[problem] === option) {
    answers.value[problem] = null; // 既に選択されていた場合は解除
  }
}

// 回答終了ボタンを押した際の処理
function endAnswering() {
  isAnsweringEnded.value = true; // 回答終了状態にする
}

// 次の試験に移るボタンを押した際の処理
function nextExam() {
  // 回答をリセット
  for (const problem in answers.value) {
    answers.value[problem] = null;
  }

  // 採点データをリセット
  for (const problem in correctAnswers.value) {
    correctAnswers.value[problem] = null;
  }
  // 回答終了状態を解除
  isAnsweringEnded.value = false;
}


// 正解・不正解の状態を保持するためのデータ
const correctAnswers = ref<Record<string, boolean | null>>(
  problems.reduce((acc, problem) => {
    acc[problem] = null; // 初期状態は未選択
    return acc;
  }, {} as Record<string, boolean | null>),
);

// 丸を押した際の処理
function markAsCorrect(problem: string) {
  correctAnswers.value[problem] = true; // 正解に設定
}

// 罰を押した際の処理
function markAsIncorrect(problem: string) {
  correctAnswers.value[problem] = false; // 不正解に設定
}

// 正解かどうかを判定
function isCorrect(problem: string): boolean {
  return correctAnswers.value[problem] === true;
}

// 不正解かどうかを判定
function isIncorrect(problem: string): boolean {
  return correctAnswers.value[problem] === false;
}

// 回答した数
const answeredCount = computed(() => {
  return Object.values(answers.value).filter((answer) => answer !== null).length;
});

// 正答数
const correctCount = computed(() => {
  return Object.values(correctAnswers.value).filter((isCorrect) => isCorrect).length;
});

// 正答率
const correctRate = computed(() => {
  if (answeredCount.value === 0) return 0;
  return (correctCount.value / answeredCount.value) * 100;
});
</script>

<style scoped>
.container {
  margin: 20px auto;
  width: 50%; /* 幅を画面の半分に制限 */
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.description {
  font-size: 16px;
  margin-bottom: 20px;
  color: #555;
}

.problem-grid {
  margin: 0 auto;
  width: 100%; /* 表がコンテナ幅いっぱいに広がる */
  table-layout: fixed; /* セル幅を均等に */
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-size: 12px;
  height: 40px;
}

.problem-column {
  width: 40px;
  font-size: 14px;
}

.radio-cell {
  position: relative;
  width: 30px;
  height: 40px;
}

.radio-input {
  display: none;
}

.radio-label {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  font-size: 10px;
  text-align: center;
}

.radio-label .background-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.1);
}

.radio-label.selected {
  background-color: #87ceeb;
  color: white;
}

.radio-label:hover {
  background-color: #e0f7fa;
}

.end-button,
.next-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

.end-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.end-button:hover {
  background-color: #388e3c;
}

.next-button {
  background-color:#f44336; /* さらに濃い赤色 */
  color: white;
  border: none;
}

.next-button:hover {
  background-color: #d32f2f;/* さらに深い赤色 */
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* サイドバーのスタイル */
.sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 180px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.sidebar p {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 回答中/採点中の背景色 */
.sidebar.answering {
  background-color: #8bc34a; /* 緑っぽい */
}

.sidebar.grading {
  background-color: #f06292; /* さらに濃い赤（採点中） */
}

/* 作成者情報のスタイル */
.author {
  margin-top: 20px;
  font-size: 14px;
}

.author a {
  color: #333;
  text-decoration: none;
  margin: 0 5px;
}

.author a:hover {
  text-decoration: underline;
}

.author i {
  margin-right: 5px;
}

.radio-cell.correct {
  background-color: #c8e6c9; /* 緑色 */
}

.radio-cell.incorrect {
  background-color: #ffcdd2; /* 赤色 */
}

</style>
