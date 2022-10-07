# Mode opératoire
## Présentation
**Cet outil vous accompagne - pas à pas - dans l'analyse des photos de blobs**, afin de fournir les mesures nécessaires à l'apprentissage du _Machine Learning_. 

L'analyse se déroule en **4 étapes** :

[1. Charger une photo](#étape-1--charger-une-photo) <br>
[2. Positionner la règle](#étape-2--positioner-la-règle) <br>
[3. Positionner la boîte de Petri](#étape-3--positionner-la-boîte-de-petri) <br>
[4. Détourer le blob à main levée](#étape-4--détourer-le-blob) <br>
[5. Télécharger les fichiers de mesures](#étape-5--télécharger-les-résultats) <br>

Chaque étape est décrite dans la partie droite du _lab_. Il est possible de revenir à tout moment
en arrière en cliquant sur le titre de l'étape.

C'est parti...

---

## Étape 1 : charger une photo

**Charger une photo** à analyser - située sur l'ordinateur - avec le **bouton "Parcourir..."**.

![img.png](file_panel.png)

Une fois la photo chargée, **l'étape 2 est automatiquement activée**.

Mais avant...

> ### Comment zoomer et déplacer la photo
> Pour prendre les mesures avec le plus de précision, il est possible de :
> * **zoomer/dézoomer (agrandir/rétrécir) la photo** avec la molette de la souris
> * **déplacer la photo** : tout en appuyant sur la touche contrôle (le curseur devient des flèches), cliquer sur la photo et la déplacer avec la souris
> 
> La barre de boutons de zoom sur le haut de la page permet d'ajuster l'affichage :
> * ![img.png](zoom_in.png) : agrandir la photo
> * ![img_1.png](zoom_out.png) : rétrécir la photo
> * ![img_2.png](zoom_fit.png) : ajuster la photo à l'écran et la repositionner au centre (:sparkles: bien utile si l'on perd la photo de vue)
> * ![img.png](zoom_1-1.png) : afficher la photo en taille réelle

Maintenant au travail !

---

## Étape 2 : positioner la règle
Cette étape permet au logiciel de déterminer l'échelle de la photo.

**Déplacer la ligne jaune à l'aide des 2 "poignées"** (petits carrés blancs) à chacune de ses extrémités afin de 
**couvrir 10cm de la règle**. 
![](ruler_handles.png)

Pour s'assurer que 10 centimètres sont bien couverts, **les petits points "détrompeurs" doivent tomber sur chaque centimètre**.

![](ruler_pokayoke.png)

Pour placer la règle avec plus de précision, utiliser le bouton ![Zoom règle](zoom_object.png) (en jaune ci-dessous).

![](ruler_panel.png)

Une fois la règle placée, **passer à l'étape suivante en appuyant sur le bouton "Terminé !"** (en vert ci-dessus).

---

## Étape 3 : positionner la boîte de Petri

Tout comme la règle, **placer la boîte de Petri à l'aide des poignées**, et utiliser le bouton ![Zoom boîte de Petri](zoom_object.png)
pour la placer avec précision.

![Poignées de la boîte de Petri](petri_handles.png)

>
>
> Au début on y va à tâtons, mais on prend vite le coup de main.
>
> 

![](petri_panel.png)

Une fois la boîte de Petri correctement positionnée, **passer à l'étape suivante en appuyant sur "C'est fini !"**

---

## Étape 4 : détourer le blob

Lors de cette étape, **entourer d'une ligne jaune le blob** (dessiner en maintenant le bouton de la souris pressé).

![](blob_draw.png)

>
> **Oh non !** Si près de la fin
>
> ![](https://i.giphy.com/media/JuFwy0zPzd6jC/giphy.webp)
> ![](blob_scrambled.png)
> 
> Il est possible de revenir en arrière sur les derniers points du tracé avec le bouton  ![](blob_back_button.png)
> 
> ![](blob_back_panel.png)
>

Lorsque l'on a rejoint le point de départ marqué par un carré blanc, **le contour est terminé et colorié en jaune**.

![Fini !](blob_closed.png)

Le bouton  ![](blob_done.png) s'active et permet de **passer à l'étape suivante**.

---

### Étape 5 : Télécharger les résultats

![](download_panel.png)

**Télécharger les fichiers un à un** avec ![](download_button.png).

Les fichiers sont stockés dans le répertoire "Téléchargements" du navigateur, **les transmettre par [la plateforme de dépôt de données](https://blob.cnrs.fr/)**.  
