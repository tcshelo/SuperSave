import { Component, OnInit } from '@angular/core';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ModalController } from '@ionic/angular';
import { Helpers } from '../helpers/helpers';
import { isEmpty } from 'lodash';
import { db, auth } from '../../environments/environment';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-new-user',
  templateUrl: './register-new-user.component.html',
  styleUrls: ['./register-new-user.component.scss'],
})
export class RegisterNewUserComponent  implements OnInit {
  user: string = '';
  userName: string = '';
  userEmail: string = '';
  userEmailCheck: string = '';
  userPassword: string = '';
  userPasswordCheck: string = '';
  userPayment: number = 0;
  stepPercentage: number = 1;
  currentStep: number = 1;

  path: string = '../../assets/avatar';
  avatars = [
    `${this.path}/0.png`,
    `${this.path}/1.png`,
    `${this.path}/2.png`,
    `${this.path}/3.png`,
    `${this.path}/4.png`,
    `${this.path}/5.png`,
    `${this.path}/6.png`,
    `${this.path}/7.png`,
    `${this.path}/8.png`,
    `${this.path}/9.png`,
    `${this.path}/10.png`,
    `${this.path}/11.png`
  ];

  selectedAvatar: string = '';

  constructor(
    private modalController: ModalController, 
    private helpers: Helpers,
    private router: Router
  ) { }

  ngOnInit() {}

  stepBack() {
    switch (this.currentStep) {
      case 1:
        this.modalController.dismiss();
        break;
      case 2:
        this.currentStep = 1;
        this.setStepPercentage(1);
        break;
      case 3:
        this.currentStep = 2;
        this.setStepPercentage(2);
        break;
      case 4:
        this.currentStep = 3;
        this.setStepPercentage(3);
        break;
      case 5:
        this.currentStep = 4;
        this.setStepPercentage(4);
        break;
    }
  }

  setStepPercentage(step: number) {
    this.stepPercentage = step;
  }

  async nextStep(step: number) {
    switch (step) {
      // Passo 1: Preencher nome e e-mail
      case 1:
        if (isEmpty(this.userName) || isEmpty(this.userEmail) || isEmpty(this.userEmailCheck)) {
          this.helpers.showFailToast("Preencha todos os campos antes de continuar.");
          break;
        } else if (this.userEmail != this.userEmailCheck) {
          this.helpers.showFailToast("Os e-mails não correspondem.");
          break;
        }

        this.currentStep = 2;
        this.setStepPercentage(2);
        break;
      
      // Passo 2: Escolher um usuário
      case 2:
        const sql = query(collection(db, 'users'), where('user', '==', this.user));
        const usersSnapshot = await getDocs(sql);

        if (isEmpty(this.user)) {
          this.helpers.showFailToast("Preencha todos os campos antes de continuar.");
          break;
        } else if (!usersSnapshot.empty) {
          this.helpers.showFailToast("Esse usuário não está disponível. Tente outro.");
          break;
        }

        this.currentStep = 3;
        this.setStepPercentage(3);
        break;

      // Passo 3: Escolher senha
      case 3:
        if (isEmpty(this.userPassword) || isEmpty(this.userPasswordCheck)) {
          this.helpers.showFailToast("Preencha todos os campos antes de continuar.");
          break;
        } else if (this.userPassword.length < 6) {
          this.helpers.showFailToast("A senha deve ter no mínimo 6 caracteres");
          break;
        } else if (this.userPassword != this.userPasswordCheck) {
          this.helpers.showFailToast("As senhas não correspondem.");
          break;
        }

        this.currentStep = 4;
        this.setStepPercentage(4);
        break;

      // Passo 4: Definir salário
      case 4:
        this.currentStep = 5;
        this.setStepPercentage(5);
        break;
    }
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
  }

  async register() {
    if (this.selectedAvatar) {
      try {
        // Criar uma nova conta de usuário com e-mail e senha
        const userCredential = await createUserWithEmailAndPassword(auth, this.userEmail, this.userPassword);
  
        // Informações do usuário para salvar no banco de dados
        const user = {
          oid: userCredential.user.uid,
          user: this.user,
          name: this.userName,
          email: this.userEmail,
          avatar: this.selectedAvatar,
          payment: this.userPayment
        };
  
        // Salvar informações do usuário na coleção 'users'
        await addDoc(collection(db, 'users'), user);
  
        // Limpar os campos de registro após o sucesso
        this.user = '';
        this.userName = '';
        this.userEmail = '';
        this.userPassword = '';
        this.userPayment = 0;
        this.selectedAvatar = '';
  
        // Voltar para a home
        this.router.navigate(['/tabs/home']);
        this.modalController.dismiss();

        this.helpers.showSuccessToast("Usuário cadastrado com sucesso!");
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
      }
    }
  }
}
