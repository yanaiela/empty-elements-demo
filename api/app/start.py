import argparse
import os
import sys
import logging
from typing import Tuple
from gevent.pywsgi import WSGIServer
from flask import Flask, Response, request, jsonify
from app.api import create_api
from app.utils import StackdriverJsonFormatter

def start():
    """
    Starts up a HTTP server attached to the provider port, and optionally
    in development mode (which is ideal for local development but unideal
    for production use).
    """
    parser = argparse.ArgumentParser(description='Starts your application\'s HTTP server.')
    parser.add_argument(
        '--port',
        '-p',
        help='The port to listen on',
        default=8000
    )
    parser.add_argument(
        '--prod',
        help=
            'If specified the server is started in production mode, where ' +
            'the server isn\'t restarted as changes to the source code occur.',
        action='store_true'
    )
    args = parser.parse_args()

    # We set the log level explicitly, as to avoid other libraries manipulating
    # it for us.
    root_logger = logging.getLogger()
    root_logger.setLevel(os.environ.get('LOG_LEVEL', default=logging.INFO))

    # In production, write all logs to stdout but format them using JSON
    # so that they're queriable by fields like their severity, etc.
    if args.prod:
        handler = logging.StreamHandler()
        handler.setFormatter(StackdriverJsonFormatter())
        root_logger.addHandler(handler)

    app = Flask(__name__)

    # Bind the API functionality to our application. You can add additional
    # API endpoints by editing api.py.
    app.register_blueprint(create_api(), url_prefix='/')

    # In production we use a HTTP server appropriate for production.
    if args.prod:
        http_server = WSGIServer(('0.0.0.0', args.port), app, log=root_logger,
            error_log=root_logger)
        app.logger.info(f'Server listening at http://0.0.0.0:{args.port}')
        http_server.serve_forever()
    else:
        app.run(host='0.0.0.0', port=args.port)

if __name__ == '__main__':
    start()
