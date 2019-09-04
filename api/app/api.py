from flask import Flask, Blueprint, jsonify, request, current_app
from random import randint
from json import dumps
from time import sleep
from predict import *



def create_api() -> Blueprint:
    """
    Creates an instance of your API. If you'd like to toggle behavior based on
    command line flags or other inputs, add them as arguments to this function.
    """
    api = Blueprint('api', __name__)

    def error(message: str, status: int = 400) -> (str, int):
        return jsonify({'error': message}), status

    # This route simply tells anything that depends on the API that it's
    # working. If you'd like to redefine this behavior that's ok, just
    # make sure a 200 is returned.
    @api.route('/')
    def index() -> (str, int):
        return '', 204


    @api.route('/getempty', methods=['POST'])
    def getempty():
        print('start')
        d = request.json
        print('new')
        print(d)

        txt = d['txt']

        # splits = txt.split()
        print(txt)
        prediction = predict(txt)
        print(prediction)

        el = prediction['elements']
        char = ''
        word = ''
        if len(el) > 0 and 'char_position' in el[0]:
            char = el[0]['char_position']
            word = el[0]['word']
        elements = [{'char_position': char,
                         'model_name': 'asaf',
                         'word': word}]

        return jsonify({
            'ok': True,
            'text': txt,
            'elements': elements
            # 'error': 'Missing SUBJ element'
        })

    return api
