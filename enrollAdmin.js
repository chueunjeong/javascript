/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// Strict Mode는 ECMAScript 5 버전에 있는 새로운 기능으로써, 당신의 프로그램 또는 함수를 엄격한 운용 콘텍스트 안에서 실행시킬 수 있게끔 합니다. 
// 이 엄격한 콘텍스트는 몇가지 액션들을 실행할 수 없도록 하며, 좀 더 많은 예외를 발생시킵니다
// Strict Mode는 몇가지 면에서 도움이 되는데:
// 흔히 발생하는 코딩 실수를 잡아내서 예외를 발생시킵니다.
// 상대적으로 안전하지 않은 액션이 발생하는 것을 방지하거나 그럴 때 예외를 발생시킵니다. 예를 들자면 전역객체들에 접근하려 한다거나 하는 것들이겠지요.
// 혼란스럽거나 제대로 고려되지 않은 기능들을 비활성화시킵니다
'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        // ccpPath경로 => ../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // 위의 경로에서 utf8 json 방식으로 읽어오기

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        // 위의 ccp(json)에서 certificateAuthorities라는 array형식의 attribute 중 'ca.org1.example.com'에 해당되는 caInfo 가져오기
        // {
        //     "url": "https://localhost:7054",
        //     "caName": "ca-org1",
        //     "tlsCACerts": {
        //         "pem": "-----BEGIN CERTIFICATE-----\nMIICUDCCAfegAwIBAgIQaoMHAWvj38IXcbYavY2DcDAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0yMDAxMjkxNTUzMDBaFw0zMDAxMjYxNTUzMDBa\nMHMxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMRkwFwYDVQQKExBvcmcxLmV4YW1wbGUuY29tMRwwGgYDVQQD\nExNjYS5vcmcxLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\nQ8+CXqVTlei+mR3Y2Vda/gVUvV+2x63UWLfPzp2HlSCc5HUY0zpAuoj6aKJEG6QO\nLo6jzeKaXAmKjTMRXUqbSqNtMGswDgYDVR0PAQH/BAQDAgGmMB0GA1UdJQQWMBQG\nCCsGAQUFBwMCBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH/MCkGA1UdDgQiBCCu\nM9gNt7l+vG7owiLjzKBW3u/15/Igtb5aiv3HPUyyiDAKBggqhkjOPQQDAgNHADBE\nAiB0NWtHNsj67lOW1CgL+yaE5axD7jJGdi2DnS1Hos3vQAIgR4bQW2L4i4VFEp0M\n3we3tfSXUxU5Xt95kRNTSbSlvK0=\n-----END CERTIFICATE-----\n"
        //     },
        //     "httpOptions": {
        //         "verify": false
        //     }
        // }
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        //위에 부분에서 tlsCACerts부분 아래의 pem부분 긁어오기
        //"-----BEGIN CERTIFICATE-----\nMIICUDCCAfegAwIBAgIQaoMHAWvj38IXcbYavY2DcDAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0yMDAxMjkxNTUzMDBaFw0zMDAxMjYxNTUzMDBa\nMHMxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMRkwFwYDVQQKExBvcmcxLmV4YW1wbGUuY29tMRwwGgYDVQQD\nExNjYS5vcmcxLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\nQ8+CXqVTlei+mR3Y2Vda/gVUvV+2x63UWLfPzp2HlSCc5HUY0zpAuoj6aKJEG6QO\nLo6jzeKaXAmKjTMRXUqbSqNtMGswDgYDVR0PAQH/BAQDAgGmMB0GA1UdJQQWMBQG\nCCsGAQUFBwMCBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH/MCkGA1UdDgQiBCCu\nM9gNt7l+vG7owiLjzKBW3u/15/Igtb5aiv3HPUyyiDAKBggqhkjOPQQDAgNHADBE\nAiB0NWtHNsj67lOW1CgL+yaE5axD7jJGdi2DnS1Hos3vQAIgR4bQW2L4i4VFEp0M\n3we3tfSXUxU5Xt95kRNTSbSlvK0=\n-----END CERTIFICATE-----\n"
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        //위의 caInfo에서 url 부분과 caTLSCACerts 부분 caName 부분을 이용하여 fabric-ca-client 모듈을 바탕으로 FabricCAServices 만들기

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        //process.cwd() 현재 작업 디렉토리/wallet        
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        //위에서 추가한 fabric-network 모듈에서 위에 경로를 통해 새 파일 시스템 기반 월렛이 생성될 때까지 기다린다.
        console.log(`Wallet path: ${walletPath}`);
        //위 경로 출력, 단 위의 작업이 끝난 후

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();