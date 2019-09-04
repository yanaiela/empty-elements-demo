import pickle

import spacy
import torch
from binary_model.linear import data2feats
from pytorch_transformers import BertForMaskedLM
from pytorch_transformers.tokenization_bert import BertTokenizer

nlp = spacy.load('en_core_web_sm')

model_name = 'app/models/'
bert = BertForMaskedLM.from_pretrained(model_name)
tokenizer = BertTokenizer.from_pretrained(model_name)
bert.eval()

linear_model = 'app/models/linear.pkl'

with open(linear_model, 'rb') as f:
    clf = pickle.load(f)


def get_predictions(model, sent, k=10):
    pre, target, post = sent.split('***')
    if 'mask' in target.lower():
        target = ['[MASK]']
    else:
        target = tokenizer.tokenize(target)
    tokens = ['[CLS]'] + tokenizer.tokenize(pre)
    target_idx = len(tokens)
    tokens += target + tokenizer.tokenize(post) + ['[SEP]']
    input_ids = tokenizer.convert_tokens_to_ids(tokens)
    tens = torch.LongTensor(input_ids).unsqueeze(0)
    res = model(tens)
    res = res[0][0, target_idx]
    res = torch.nn.functional.softmax(res, -1)
    probs, best_k = torch.topk(res, k)
    best_k = [int(x) for x in best_k]
    best_k = tokenizer.convert_ids_to_tokens(best_k)
    return list(best_k)


def prepare4bert(text, index):
    s = nlp(text)
    tokens = []
    for w in s:
        tokens.append(w.text)
        if w.i == index:
            tokens.append('***mask***')

    return tokens


def predict(text):
    s = nlp(text)

    candidates = []
    positions = []
    for w in s:
        if w.pos_ in ['VERB']:
            candidates.append([text, w.i])
            positions.append(s[w.i + 1].idx)

    features = data2feats(candidates)
    y_hat = clf.predict(features)

    missing = []
    for x, y, pos in zip(candidates, y_hat, positions):
        if y == 1:
            missing.append([x, pos])

    out = {'text': text, 'elements': []}
    if len(missing) > 0:
        # TODO currently predicting on a single missing verb
        for mis, pos in missing[:1]:
            tokens = prepare4bert(*mis)
            sentence = ' '.join(tokens)
            completion = get_predictions(bert, sentence)

            char_position = pos
            out['elements'].append({'word': completion[0] + ' ', 'char_position': char_position})
    return out
