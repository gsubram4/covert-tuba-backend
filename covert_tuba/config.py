import logging 

LOG_FILENAME = 'logs/covert_tuba.log'
LOG_FORMAT = '%(levelname)-10s %(asctime)s %(filename)-20s %(funcName)-25s %(lineno)-5d: %(message)s'
formatter = logging.Formatter(LOG_FORMAT)

# Set up a specific logger with our desired output level
logger = logging.getLogger('covert_tuba')
logger.setLevel(logging.DEBUG)

# Add the log message handler to the logger
handler = logging.handlers.RotatingFileHandler(
              LOG_FILENAME, maxBytes=200000, backupCount=5)
handler.setFormatter(formatter)
logger.addHandler(handler)

# define a Handler which writes messages or higher to the sys.stderr
console = logging.StreamHandler()
console.setLevel(logging.DEBUG)
console.setFormatter(formatter)
logger.addHandler(console)