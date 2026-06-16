// eslint-disable-next-line no-unused-vars
let count = 0;

export default {
    methods: {
        can(val) {
            count++;
            const rl = this.$store.state.auth.user.roles;

            if (rl == null) {
                return false
            }

            for (let i = 0; i < rl.length; i++) {
                if (rl[i] === val) {
                    return true
                }
            }
            console.log(count)
        },
        translit(word) {
            const converter = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
                'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
                'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
                'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
                'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
                'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
                'э': 'e', 'ю': 'yu', 'я': 'ya'
            };

            word = word.toLowerCase();

            let answer = '';
            for (let i = 0; i < word.length; ++i) {
                if (converter[word[i]] === undefined) {
                    answer += word[i];
                } else {
                    answer += converter[word[i]];
                }
            }

            answer = answer.replace(/[^-0-9a-z]/g, '-');
            answer = answer.replace(/[-]+/g, '-');
            answer = answer.replace(/^-|-$/g, '');
            return answer;
        }
    }
}