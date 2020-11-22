CODE_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
CWD := ${CURDIR}

COMMON=$(CODE_DIR)/*.go $(CODE_DIR)/internal/*/*.go

FUNCTION=$(CODE_DIR)/build/reader
FUNCTION_SRC=$(CODE_DIR)/src/*.go
CDK_STACK=$(CODE_DIR)/lib/remo2cw-stack.js
CDK_SRC=$(CODE_DIR)/lib/remo2cw-stack.ts

all: deploy


$(FUNCTION): $(FUNCTION_SRC)
	cd $(CODE_DIR) && env GOARCH=amd64 GOOS=linux go build -o $(CODE_DIR)/build/reader ./src/ && cd $(CWD)

$(CDK_STACK): $(CDK_SRC)
	cd $(CODE_DIR) && tsc && cd $(CWD)

deploy: $(FUNCTION) $(CDK_STACK)
	cdk deploy
