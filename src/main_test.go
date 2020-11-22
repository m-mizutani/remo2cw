package main_test

import (
	"os"
	"testing"

	"github.com/Netflix/go-env"
	"github.com/stretchr/testify/require"

	main "github.com/m-mizutani/remo2cw/src"
)

func TestRun(t *testing.T) {
	if _, ok := os.LookupEnv("REMO_API_TOKEN"); !ok {
		t.Skip("No REMO_API_TOKEN")
	}

	var args main.Arguments
	_, err := env.UnmarshalFromEnviron(&args)
	require.NoError(t, err)

	require.NoError(t, main.Handler(&args))
}
